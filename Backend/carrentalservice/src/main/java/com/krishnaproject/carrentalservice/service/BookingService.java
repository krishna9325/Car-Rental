package com.krishnaproject.carrentalservice.service;

import com.krishnaproject.carrentalservice.dto.*;
import com.krishnaproject.carrentalservice.entity.*;
import com.krishnaproject.carrentalservice.enums.BookingStatus;
import com.krishnaproject.carrentalservice.exception.*;
import com.krishnaproject.carrentalservice.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private RedissonClient redissonClient;

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        String lockKey = "car:lock:" + request.getCarId();
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // Try to acquire lock with 10-second wait time and 30-second lease time
            boolean isLocked = lock.tryLock(10, 30, TimeUnit.SECONDS);

            if (!isLocked) {
                throw new RuntimeException("Unable to acquire lock. Please try again.");
            }

            log.info("Lock acquired for car: {}", request.getCarId());

            // Fetch car with pessimistic write lock - FIXED: Added pessimistic lock
            Car car = carRepository.findById(request.getCarId())
                    .orElseThrow(() -> new CarNotFoundException("Car not found"));

            log.info("car count: {}", car.getCount());

            // Validate availability
            if (car.getCount() <= 0) {
                throw new IllegalStateException("Car is out of stock");
            }

            // Validate dates
            if (request.getStartDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Start date cannot be in the past");
            }

            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new IllegalArgumentException("End date must be after start date");
            }

            // Check for conflicting bookings
//            List<Booking> conflictingBookings = bookingRepository.findByCarIdAndStatus(
//                    request.getCarId(), BookingStatus.CONFIRMED);
//
//            for (Booking existing : conflictingBookings) {
//                if (!(request.getEndDate().isBefore(existing.getStartDate()) ||
//                        request.getStartDate().isAfter(existing.getEndDate()))) {
//                    throw new IllegalStateException("Car is already booked for these dates");
//                }
//            }

            // Calculate total price
            long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
            if (days == 0) days = 1; // Minimum 1 day
            double totalPrice = car.getPricePerDay() * days;

            // Create pending booking
            Booking booking = new Booking();
            booking.setCar(car);
            booking.setUserId(request.getUserId());
            booking.setStartDate(request.getStartDate());
            booking.setEndDate(request.getEndDate());
            booking.setTotalPrice(totalPrice);
            booking.setStatus(BookingStatus.PENDING);

            // Temporarily reduce car count
            car.setCount(car.getCount() - 1);
            carRepository.save(car);

            booking = bookingRepository.save(booking);

            log.info("Booking created: {}. Car count reduced to: {}", booking.getId(), car.getCount());

            // Schedule async timeout checker
            scheduleBookingTimeout(booking.getId());

            return mapToResponse(booking);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Booking process interrupted", e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.info("Lock released for car: {}", request.getCarId());
            }
        }
    }

    @Transactional
    public BookingResponseDto confirmPayment(PaymentRequestDto paymentRequest) {
        String lockKey = "booking:lock:" + paymentRequest.getBookingId();
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean isLocked = lock.tryLock(5, 15, TimeUnit.SECONDS);

            if (!isLocked) {
                throw new RuntimeException("Unable to process payment. Please try again.");
            }

            Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Check if booking is still valid
            if (booking.getStatus() != BookingStatus.PENDING) {
                throw new IllegalStateException("Booking is not in pending state");
            }

            if (LocalDateTime.now().isAfter(booking.getPaymentDeadline())) {
                throw new IllegalStateException("Payment deadline expired");
            }

            // Simulate payment processing (fake payment)
            boolean paymentSuccess = processFakePayment(paymentRequest);

            if (paymentSuccess) {
                booking.setStatus(BookingStatus.CONFIRMED);
                booking = bookingRepository.save(booking);

                log.info("Payment confirmed for booking: {}", booking.getId());

                return mapToResponse(booking);
            } else {
                // Payment failed - restore car count with pessimistic lock
                restoreCarCountWithLock(booking);
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);

                throw new RuntimeException("Payment processing failed");
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Payment process interrupted", e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // Scheduled task to handle expired bookings (runs every minute)
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    @Transactional
    public void handleExpiredBookings() {
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(LocalDateTime.now());

        for (Booking booking : expiredBookings) {
            String lockKey = "booking:lock:" + booking.getId();
            RLock lock = redissonClient.getLock(lockKey);

            try {
                if (lock.tryLock(2, 5, TimeUnit.SECONDS)) {
                    // Double-check status (might have been confirmed meanwhile)
                    booking = bookingRepository.findById(booking.getId()).orElse(null);

                    if (booking != null && booking.getStatus() == BookingStatus.PENDING) {
                        log.info("Expiring booking: {}", booking.getId());

                        // Restore car count with pessimistic lock - FIXED
                        restoreCarCountWithLock(booking);

                        // Update booking status
                        booking.setStatus(BookingStatus.EXPIRED);
                        bookingRepository.save(booking);

                        log.info("Booking expired: {}. Car count restored.", booking.getId());
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Error expiring booking: {}", booking.getId(), e);
            } finally {
                if (lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }
    }

    // Scheduled task to mark completed bookings (runs daily)
    @Scheduled(cron = "0 0 2 * * *") // 2 AM daily
    @Transactional
    public void markCompletedBookings() {
        List<Booking> completedBookings = bookingRepository.findCompletedBookings(LocalDateTime.now());

        for (Booking booking : completedBookings) {
            String lockKey = "booking:lock:" + booking.getId();
            RLock lock = redissonClient.getLock(lockKey);

            try {
                if (lock.tryLock(2, 5, TimeUnit.SECONDS)) {
                    // FIXED: Re-fetch with pessimistic lock to prevent race condition
                    booking = bookingRepository.findById(booking.getId()).orElse(null);

                    if (booking != null && booking.getStatus() == BookingStatus.CONFIRMED) {
                        booking.setStatus(BookingStatus.COMPLETED);
                        bookingRepository.save(booking);

                        // Restore car count with pessimistic lock - FIXED
                        restoreCarCountWithLock(booking);

                        log.info("Booking completed and car count restored: {}", booking.getId());
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Error completing booking: {}", booking.getId(), e);
            } finally {
                if (lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }
    }

    @Async
    protected void scheduleBookingTimeout(Long bookingId) {
        // This runs asynchronously to check timeout
        log.info("Timeout checker scheduled for booking: {}", bookingId);
    }

    // FIXED: New method to restore car count with pessimistic lock
    private void restoreCarCountWithLock(Booking booking) {
        String carLockKey = "car:lock:" + booking.getCar().getId();
        RLock carLock = redissonClient.getLock(carLockKey);

        try {
            if (carLock.tryLock(5, 10, TimeUnit.SECONDS)) {
                // Fetch car with pessimistic lock
                Car car = carRepository.findByIdWithLock(booking.getCar().getId())
                        .orElseThrow(() -> new RuntimeException("Car not found"));

                car.setCount(car.getCount() + 1);
                carRepository.save(car);

                log.info("Car count restored for car: {}. New count: {}", car.getId(), car.getCount());
            } else {
                log.error("Failed to acquire lock for restoring car count: {}", booking.getCar().getId());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Interrupted while restoring car count", e);
        } finally {
            if (carLock.isHeldByCurrentThread()) {
                carLock.unlock();
            }
        }
    }

    // Deprecated - use restoreCarCountWithLock instead
    @Deprecated
    private void restoreCarCount(Booking booking) {
        Car car = booking.getCar();
        car.setCount(car.getCount() + 1);
        carRepository.save(car);
        log.info("Car count restored for car: {}. New count: {}", car.getId(), car.getCount());
    }

    private boolean processFakePayment(PaymentRequestDto payment) {
        // Simulate payment processing delay
        try {
            Thread.sleep(1000); // 1 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 95% success rate for simulation
        return Math.random() < 0.95;
    }

    private BookingResponseDto mapToResponse(Booking booking) {
        BookingResponseDto response = new BookingResponseDto();
        response.setBookingId(booking.getId());
        response.setCarId(booking.getCar().getId());
        response.setCarName(booking.getCar().getCarName());
        response.setBrand(booking.getCar().getBrand());
        response.setStartDate(booking.getStartDate());
        response.setEndDate(booking.getEndDate());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        response.setPaymentDeadline(booking.getPaymentDeadline());

        if (booking.getStatus() == BookingStatus.PENDING) {
            long seconds = ChronoUnit.SECONDS.between(LocalDateTime.now(), booking.getPaymentDeadline());
            response.setRemainingSeconds((int) Math.max(0, seconds));
        }

        return response;
    }

    public BookingResponseDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    public List<BookingResponseDto> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }
}
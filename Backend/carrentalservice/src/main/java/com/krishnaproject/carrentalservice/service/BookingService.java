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
            // Acquire lock briefly to decrement count
            boolean isLocked = lock.tryLock(5, 10, TimeUnit.SECONDS);

            if (!isLocked) {
                throw new RuntimeException("Unable to acquire lock. Please try again.");
            }

            Car car = carRepository.findByIdWithLock(request.getCarId())
                    .orElseThrow(() -> new CarNotFoundException("Car not found"));

            if (car.getCount() <= 0) {
                throw new IllegalStateException("Car is out of stock");
            }

            if (request.getStartDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Start date cannot be in the past");
            }

            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new IllegalArgumentException("End date must be after start date");
            }

            long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
            if (days == 0) days = 1;
            double totalPrice = car.getPricePerDay() * days;

            // Decrement car count
            car.setCount(car.getCount() - 1);
            carRepository.save(car);

            Booking booking = new Booking();
            booking.setCar(car);
            booking.setUserId(request.getUserId());
            booking.setStartDate(request.getStartDate());
            booking.setEndDate(request.getEndDate());
            booking.setTotalPrice(totalPrice);
            booking.setStatus(BookingStatus.PENDING);

            booking = bookingRepository.save(booking);

            log.info("Booking created: {}. Car count reduced to: {}", booking.getId(), car.getCount());

            // Release lock immediately
            lock.unlock();

            scheduleBookingTimeout(booking.getId());

            return mapToResponse(booking);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Booking process interrupted", e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Transactional
    public BookingResponseDto confirmPayment(PaymentRequestDto paymentRequest) {
        Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking is not in pending state");
        }

        if (LocalDateTime.now().isAfter(booking.getPaymentDeadline())) {
            // Restore car count if expired
            restoreCarCountWithLock(booking);
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new IllegalStateException("Payment deadline expired");
        }

        boolean paymentSuccess = processFakePayment(paymentRequest);

        if (paymentSuccess) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            log.info("Payment confirmed for booking: {}", booking.getId());
        } else {
            // Payment failed, restore count
            restoreCarCountWithLock(booking);
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            throw new RuntimeException("Payment failed");
        }

        return mapToResponse(booking);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void handleExpiredBookings() {
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(LocalDateTime.now());

        for (Booking booking : expiredBookings) {
            restoreCarCountWithLock(booking);
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            log.info("Expired booking handled: {}", booking.getId());
        }
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void markCompletedBookings() {
        List<Booking> completedBookings = bookingRepository.findCompletedBookings(LocalDateTime.now());

        for (Booking booking : completedBookings) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
            restoreCarCountWithLock(booking);
            log.info("Completed booking: {}", booking.getId());
        }
    }

    @Async
    protected void scheduleBookingTimeout(Long bookingId) {
        log.info("Timeout checker scheduled for booking: {}", bookingId);
    }

    private void restoreCarCountWithLock(Booking booking) {
        String carLockKey = "car:lock:" + booking.getCar().getId();
        RLock carLock = redissonClient.getLock(carLockKey);

        try {
            if (carLock.tryLock(5, 10, TimeUnit.SECONDS)) {
                Car car = carRepository.findByIdWithLock(booking.getCar().getId())
                        .orElseThrow(() -> new RuntimeException("Car not found"));
                car.setCount(car.getCount() + 1);
                carRepository.save(car);
                log.info("Car count restored for car: {}", car.getId());
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

    private boolean processFakePayment(PaymentRequestDto payment) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
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

package com.krishnaproject.carrentalservice.repository;

import com.krishnaproject.carrentalservice.entity.Booking;
import com.krishnaproject.carrentalservice.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByCarIdAndStatus(Long carId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.paymentDeadline < :now")
    List<Booking> findExpiredPendingBookings(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status = 'CONFIRMED' AND b.endDate < :today")
    List<Booking> findCompletedBookings(@Param("today") LocalDateTime today);
}
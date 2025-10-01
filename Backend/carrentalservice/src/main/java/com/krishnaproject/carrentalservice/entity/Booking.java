package com.krishnaproject.carrentalservice.entity;

import com.krishnaproject.carrentalservice.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, COMPLETED, CANCELLED, EXPIRED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Payment timeout tracking
    private LocalDateTime paymentDeadline;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Set 5-minute payment deadline
        paymentDeadline = LocalDateTime.now().plusMinutes(5);
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
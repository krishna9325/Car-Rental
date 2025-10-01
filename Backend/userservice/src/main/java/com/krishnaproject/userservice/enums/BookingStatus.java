package com.krishnaproject.userservice.enums;

public enum BookingStatus {
    PENDING,      // Initial booking created, payment pending
    CONFIRMED,    // Payment successful
    COMPLETED,    // Rental period completed
    CANCELLED,    // User cancelled
    EXPIRED       // Payment timeout
}
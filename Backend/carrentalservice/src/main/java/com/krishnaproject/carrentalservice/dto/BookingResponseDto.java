package com.krishnaproject.carrentalservice.dto;

import com.krishnaproject.carrentalservice.enums.BookingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingResponseDto {
    private Long bookingId;
    private Long carId;
    private String carName;
    private String brand;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
    private BookingStatus status;
    private LocalDateTime paymentDeadline;
    private Integer remainingSeconds;
}

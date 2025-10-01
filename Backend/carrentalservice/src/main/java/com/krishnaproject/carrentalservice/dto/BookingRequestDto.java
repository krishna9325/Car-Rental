package com.krishnaproject.carrentalservice.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequestDto {
    private Long carId;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long cityId;
}


package com.krishnaproject.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private Long bookingId;
    private String paymentMethod;
    private Double amount;

    // Optional card details for validation (if needed)
    private String cardNumber;
    private String cardName;
    private String expiryDate;
    private String cvv;

    // Optional UPI details
    private String upiId;

    // Optional net banking details
    private String bankName;
}
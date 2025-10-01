package com.krishnaproject.userservice.controller;

import com.krishnaproject.userservice.client.CarClient;
import com.krishnaproject.userservice.dto.BookingRequestDto;
import com.krishnaproject.userservice.dto.BookingResponseDto;
import com.krishnaproject.userservice.dto.PaymentRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/bookings")
public class BookingController {

    @Autowired
    private CarClient bookingClient;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto request) {
        return ResponseEntity.ok(bookingClient.createBooking(request));
    }

    @PostMapping("/payment")
    public ResponseEntity<BookingResponseDto> confirmPayment(@RequestBody PaymentRequestDto payment) {
        return ResponseEntity.ok(bookingClient.confirmPayment(payment));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingClient.getBooking(bookingId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingClient.getUserBookings(userId));
    }
}

package com.krishnaproject.userservice.client;
import com.krishnaproject.userservice.config.FeignConfig;
import com.krishnaproject.userservice.dto.BookingRequestDto;
import com.krishnaproject.userservice.dto.BookingResponseDto;
import com.krishnaproject.userservice.dto.PaymentRequestDto;
import com.krishnaproject.userservice.model.Car;
import com.krishnaproject.userservice.model.City;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service", configuration = FeignConfig.class)
public interface CarClient {
    @GetMapping("/cars/public")
    List<Car> getAllCars();

    @GetMapping("/cars/public/{id}")
    Car getCarById(@PathVariable Long id);

    @PutMapping("/rent/cars/{id}/{count}")
    void updateCar(@PathVariable Long id, @PathVariable int count);

    @GetMapping("/cars/cities")
    List<City> getAllCities();

    @PostMapping("/cars/bookings")
    BookingResponseDto createBooking(@RequestBody BookingRequestDto request);

    @PostMapping("/cars/bookings/payment")
    BookingResponseDto confirmPayment(@RequestBody PaymentRequestDto payment);

    @GetMapping("/cars/bookings/{bookingId}")
    BookingResponseDto getBooking(@PathVariable Long bookingId);

    @GetMapping("/cars/bookings/user/{userId}")
    List<BookingResponseDto> getUserBookings(@PathVariable Long userId);
}
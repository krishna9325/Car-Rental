package com.krishnaproject.userservice.client;

import com.krishnaproject.userservice.config.FeignConfig;
import com.krishnaproject.userservice.dto.AuthResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "auth-service", configuration = FeignConfig.class)
public interface AuthClient {
    @PostMapping("/auth/login")
    AuthResponse clientLogin(@RequestBody Map<String, String> request);

    @PostMapping("/auth/signup")
    AuthResponse clientSignup(@RequestBody Map<String, String> request);
}


package com.krishnaproject.admin.client;

import com.krishnaproject.admin.config.FeignConfig;
import com.krishnaproject.admin.dto.AuthResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "auth-service", configuration = FeignConfig.class)
public interface AuthClient {
    @PostMapping("/auth/login")
    AuthResponse adminLogin(@RequestBody Map<String, String> request);

    @PostMapping("/auth/signup")
    AuthResponse adminSignup(@RequestBody Map<String, String> request);
}

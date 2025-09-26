package com.krishnaproject.admin.client;

import com.krishnaproject.admin.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "auth-service", configuration = FeignConfig.class)
public interface AuthClient {
    @PostMapping("/auth/login")
    Map<String, String> adminLogin(@RequestBody Map<String, String> request);

    @PostMapping("/auth/signup")
    Map<String, String> adminSignup(@RequestBody Map<String, String> request);
}

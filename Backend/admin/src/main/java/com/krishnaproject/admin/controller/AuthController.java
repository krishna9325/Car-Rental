package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.client.AuthClient;
import com.krishnaproject.admin.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AuthController {

    private final AuthClient authClient;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody Map<String, String> request) {
        AuthResponse response = authClient.adminLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> adminSignup(@RequestBody Map<String, String> request) {
        AuthResponse response = authClient.adminSignup(request);
        return ResponseEntity.ok(response);
    }
}

package com.krishnaproject.userservice.controller;

import com.krishnaproject.userservice.client.AuthClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {

    private final AuthClient authClient;

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody Map<String, String> request) {
        Map<String, String> response = authClient.clientLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> adminSignup(@RequestBody Map<String, String> request) {
        Map<String, String> response = authClient.clientSignup(request);
        return ResponseEntity.ok(response);
    }
}

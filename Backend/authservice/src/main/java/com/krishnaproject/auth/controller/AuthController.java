package com.krishnaproject.auth.controller;

import com.krishnaproject.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        String role = request.getOrDefault("role", "USER");

        String token = authService.signup(username, password, role);
        System.out.println("From auth-service" + username + " " + password + " " + token);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String role = request.getOrDefault("role", "USER");

        String token = authService.login(username, password, role);
        System.out.println("From auth-service login" + username + " " + password + " " + token);
        return ResponseEntity.ok(Map.of("token", token));
    }
}

package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.client.AuthClient;
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
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        try {
            Map<String, String> response = authClient.adminLogin(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "error", true,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> adminSignup(@RequestBody Map<String, String> request) {
        try {
            Map<String, String> response = authClient.adminSignup(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "error", true,
                    "message", e.getMessage()
            ));
        }
    }
}

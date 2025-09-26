package com.krishnaproject.auth.service;

import com.krishnaproject.auth.entity.User;
import com.krishnaproject.auth.exception.InvalidUserOrPasswordException;
import com.krishnaproject.auth.exception.UserAlreadyExistException;
import com.krishnaproject.auth.repository.UserRepository;
import com.krishnaproject.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.dao.DataAccessException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public String signup(String username, String password, String expectedRole) {
        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistException("Username already exists, try with a different username.");
        }

        try {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(expectedRole);
            userRepository.save(user);
        } catch (DataAccessException e) {
            // Handle database save failures, e.g., connection issues or constraints
            throw new RuntimeException("An error occurred while creating the user account. Please try again later.", e);
        }

        try {
            return jwtUtil.generateToken(username, expectedRole);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to generate authentication token. Please contact support.", e);
        }
    }

    // ---------------- Login ----------------
    public String login(String username, String password, String expectedRole) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidUserOrPasswordException("Invalid username/password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidUserOrPasswordException("Invalid username/password");
        }
        System.out.println("Expected roke from login auth: " + expectedRole);

        if (!user.getRole().equalsIgnoreCase(expectedRole)) {
            throw new RuntimeException("Access denied for this role");
        }

        try {
            return jwtUtil.generateToken(username, user.getRole());
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to generate authentication token. Please try again.", e);
        }
    }
}
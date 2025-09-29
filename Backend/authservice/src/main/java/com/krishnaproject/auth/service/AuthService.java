package com.krishnaproject.auth.service;

import com.krishnaproject.auth.entity.User;
import com.krishnaproject.auth.exception.AccessDeniedException;
import com.krishnaproject.auth.exception.InvalidUserOrPasswordException;
import com.krishnaproject.auth.exception.UserAlreadyExistException;
import com.krishnaproject.auth.repository.UserRepository;
import com.krishnaproject.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public String signup(String username, String password, String role) {
        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistException("Username already exists. Try a different one.");
        }

        try {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to create user account. Please try again later.", e);
        }

        try {
            return jwtUtil.generateToken(username, role);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to generate authentication token.", e);
        }
    }

    public String login(String username, String password, String expectedRole) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidUserOrPasswordException("Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidUserOrPasswordException("Invalid username or password.");
        }

        if (!user.getRole().equalsIgnoreCase(expectedRole)) {
            throw new AccessDeniedException("Access denied for this role.");
        }

        try {
            return jwtUtil.generateToken(username, user.getRole());
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to generate authentication token.", e);
        }
    }
}

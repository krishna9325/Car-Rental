package com.krishnaproject.auth.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration-ms}")
    private long EXPIRATION_MS;

    public String generateToken(String username, String role) {
        return JWT.create()
                .withSubject(username)
                .withClaim("role", role) // Store roles as "ADMIN", "USER", etc.
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .sign(Algorithm.HMAC256(SECRET));
    }

    public DecodedJWT validateToken(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET))
                .build()
                .verify(token);
    }

    public String getUsername(String token) {
        return validateToken(token).getSubject();
    }

    public String getRole(String token) {
        return validateToken(token).getClaim("role").asString();
    }
}

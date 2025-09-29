package com.krishnaproject.userservice.config;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class FeignConfig {
    @Bean
    public ErrorDecoder errorDecoder() {
        return new FeignCustomErrorDecoder();
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getCredentials() != null) {
                String token = authentication.getCredentials().toString();
                template.header("Authorization", "Bearer " + token);
            } else {
                System.out.println("Warning: No authentication credentials found for Feign request");
            }
        };
    }

}

package com.krishnaproject.userservice.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class FeignCustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Exception decode(String methodKey, Response response) {
        String body = "";
        try {
            if (response.body() != null) {
                body = new String(response.body().asInputStream().readAllBytes(), StandardCharsets.UTF_8);
            }

            String message = extractMessage(body);

            return switch (response.status()) {
                case 400 -> new RuntimeException("Bad Request: " + message);
                case 401 -> new RuntimeException("Unauthorized: " + message);
                case 403 -> new RuntimeException("Forbidden: " + message);
                case 404 -> new RuntimeException("Not Found: " + message);
                case 409 -> new RuntimeException("Conflict: " + message);
                case 422 -> new RuntimeException("Unprocessable Entity: " + message);
                case 500 -> new RuntimeException("Internal Server Error: " + message);
                case 502 -> new RuntimeException("Bad Gateway: " + message);
                case 503 -> new RuntimeException("Service Unavailable: " + message);
                default -> new RuntimeException("HTTP " + response.status() + ": " + message);
            };
        } catch (Exception e) {
            System.out.println("Error in FeignCustomErrorDecoder: " + e.getMessage());
            return new RuntimeException("Error processing response: " + e.getMessage());
        }
    }

    private String extractMessage(String body) {
        if (body == null || body.isEmpty()) {
            return "No message in response";
        }

        try {
            // Try to parse as JSON and extract message field
            JsonNode jsonNode = objectMapper.readTree(body);
            if (jsonNode.has("message")) {
                return jsonNode.get("message").asText();
            }
        } catch (Exception e) {
            // If JSON parsing fails, return the body as is
            System.out.println("Failed to parse JSON response: " + e.getMessage());
        }

        return body;
    }
}
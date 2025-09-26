package com.krishnaproject.admin.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.stereotype.Component;

@Component
public class FeignCustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Exception decode(String methodKey, Response response) {
        try {
            String body = response.body() != null
                    ? new String(response.body().asInputStream().readAllBytes())
                    : "";

            JsonNode json = objectMapper.readTree(body);

            String message = json.has("message") ? json.get("message").asText() : body;

            return switch (response.status()) {
                case 409 -> new RuntimeException(message); // clean message
                case 401, 403 -> new RuntimeException(message);
                default -> defaultDecoder.decode(methodKey, response);
            };
        } catch (Exception e) {
            return new RuntimeException("Error decoding Feign response", e);
        }
    }
}

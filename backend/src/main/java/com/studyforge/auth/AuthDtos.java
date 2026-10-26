package com.studyforge.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            String email,
            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
            String password,
            @NotBlank(message = "Name is required")
            @Size(max = 50, message = "Name must be 50 characters or fewer")
            String displayName) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") String email,
            @NotBlank(message = "Password is required") String password) {}

    public record UserInfo(String id, String email, String displayName) {}

    public record AuthResponse(String token, UserInfo user) {}
}

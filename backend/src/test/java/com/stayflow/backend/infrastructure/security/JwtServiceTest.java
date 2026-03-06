package com.stayflow.backend.infrastructure.security;

import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "stayflow-super-secret-jwt-key-change-in-production-2024",
                3600000L
        );

        user = User.builder()
                .id(1L)
                .email("user@test.com")
                .role(UserRole.RENTER)
                .enabled(true)
                .build();
    }

    @Test
    void shouldGenerateToken_forUser() {
        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void shouldExtractEmail_fromToken() {
        String token = jwtService.generateToken(user);

        String email = jwtService.extractEmail(token);

        assertEquals("user@test.com", email);
    }

    @Test
    void shouldValidateToken_whenTokenIsValid() {
        String token = jwtService.generateToken(user);

        boolean isValid = jwtService.isTokenValid(token, user);

        assertTrue(isValid);
    }

    @Test
    void shouldReturnFalse_whenTokenBelongsToDifferentUser() {
        String token = jwtService.generateToken(user);
        User otherUser = User.builder()
                .id(2L)
                .email("other@test.com")
                .role(UserRole.RENTER)
                .enabled(true)
                .build();

        boolean isValid = jwtService.isTokenValid(token, otherUser);

        assertFalse(isValid);
    }

    @Test
    void shouldGenerateToken_withExpirationInFuture() {
        String token = jwtService.generateToken(user);

        assertFalse(jwtService.isTokenExpired(token));
    }

    @Test
    void shouldExtractRole_fromToken() {
        String token = jwtService.generateToken(user);

        String role = jwtService.extractRole(token);

        assertEquals("RENTER", role);
    }
}
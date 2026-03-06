package com.stayflow.backend.web.auth;

import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRole;
import com.stayflow.backend.domain.user.UserService;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.infrastructure.security.JwtService;
import com.stayflow.backend.web.auth.dto.AuthResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber(),
                UserRole.valueOf(request.getRole())
        );
        emailService.sendVerificationCode(user.getEmail(), user.getVerificationCode());
        return ResponseEntity.ok("Registration successful! Please check your email.");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@Valid @RequestBody VerifyEmailRequest request) {
        userService.verifyEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok("Email verified successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userService.findUserByEmail(request.getEmail());
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build());
    }
}
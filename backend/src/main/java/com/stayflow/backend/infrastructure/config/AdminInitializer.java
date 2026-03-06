package com.stayflow.backend.infrastructure.config;

import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRepository;
import com.stayflow.backend.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Bean
    public CommandLineRunner createAdmin() {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = User.builder()
                        .firstName("Super")
                        .lastName("Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .phoneNumber("+000000000")
                        .role(UserRole.ADMIN)
                        .emailVerified(true)
                        .enabled(true)
                        .build();

                userRepository.save(admin);
                log.info("Admin created: {}", adminEmail);
            } else {
                log.info("Admin is here");
            }
        };
    }
}

package com.stayflow.backend.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.stayflow.backend.domain.apartment.ApartmentAvailableDatesRepository;
import com.stayflow.backend.domain.apartment.ApartmentRepository;
import com.stayflow.backend.domain.payment.PaymentRepository;
import com.stayflow.backend.domain.reservation.ReservationRepository;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRepository;
import com.stayflow.backend.domain.user.UserRole;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ApartmentRepository apartmentRepository;

    @Autowired
    protected ApartmentAvailableDatesRepository apartmentAvailableDatesRepository;

    @Autowired
    protected ReservationRepository reservationRepository;

    @Autowired
    protected PaymentRepository paymentRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @BeforeEach
    void cleanDatabase() {
        paymentRepository.deleteAll();
        reservationRepository.deleteAll();
        apartmentAvailableDatesRepository.deleteAll();
        apartmentRepository.deleteAll();
        userRepository.deleteAll();

        ensureAdminExists();
    }

    private void ensureAdminExists() {
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
        }
    }
}

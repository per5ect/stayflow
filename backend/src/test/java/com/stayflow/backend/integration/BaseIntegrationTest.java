package com.stayflow.backend.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.BeforeEach;

import com.stayflow.backend.domain.apartment.ApartmentAvailableDatesRepository;
import com.stayflow.backend.domain.apartment.ApartmentRepository;
import com.stayflow.backend.domain.payment.PaymentRepository;
import com.stayflow.backend.domain.reservation.ReservationRepository;
import com.stayflow.backend.domain.user.UserRepository;

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

    @BeforeEach
    void cleanDatabase() {
        paymentRepository.deleteAll();
        reservationRepository.deleteAll();
        apartmentAvailableDatesRepository.deleteAll();
        apartmentRepository.deleteAll();
        userRepository.deleteAll();
    }
}

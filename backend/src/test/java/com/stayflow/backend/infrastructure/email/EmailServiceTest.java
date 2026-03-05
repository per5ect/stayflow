package com.stayflow.backend.infrastructure.email;

import com.stayflow.backend.domain.payment.Payment;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.user.User;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    private Payment testPayment;

    @BeforeEach
    void setUp() {
        User renter = User.builder()
                .id(1L)
                .firstName("Petr")
                .lastName("Svoboda")
                .build();

        Reservation reservation = Reservation.builder()
                .renter(renter)
                .checkIn(LocalDate.of(2025, 7, 1))
                .checkOut(LocalDate.of(2025, 7, 5))
                .build();

        testPayment = Payment.builder()
                .receiptNumber("RCP-123")
                .transactionId("TXN-123")
                .amount(BigDecimal.valueOf(400))
                .commission(BigDecimal.valueOf(40))
                .landlordPayout(BigDecimal.valueOf(360))
                .cardBrand("VISA")
                .cardLastFour("4242")
                .paidAt(LocalDateTime.now())
                .reservation(reservation)
                .build();
    }

    @Test
    void shouldSendVerificationEmail_toCorrectRecipient() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendVerificationCode("user@test.com", "123456");

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void shouldSendReservationApprovedEmail() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendReservationApproved("renter@test.com", "Nice apartment", "Welcome!");

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void shouldSendReservationDeclinedEmail() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendReservationDeclined("renter@test.com", "Nice apartment", "Sorry");

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void shouldSendDetailedReceiptToRenter() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendPaymentReceiptToRenter("renter@test.com", testPayment);

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void shouldSendDetailedReceiptToLandlord() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendPaymentReceiptToLandlord("landlord@test.com", testPayment);

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void shouldNotThrowException_whenMailSenderFails() {
        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("Mail server error"));

        assertDoesNotThrow(() ->
                emailService.sendVerificationCode("user@test.com", "123456"));
    }
}
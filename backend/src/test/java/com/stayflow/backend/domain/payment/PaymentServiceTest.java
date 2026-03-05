package com.stayflow.backend.domain.payment;

import com.stayflow.backend.common.exception.payment.PaymentException;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationStatus;
import com.stayflow.backend.domain.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;

    private User renter;
    private User landlord;
    private Reservation reservation;

    @BeforeEach
    void setUp() {
        renter = User.builder()
                .id(1L)
                .firstName("Petr")
                .lastName("Svoboda")
                .email("renter@test.com")
                .build();

        landlord = User.builder()
                .id(2L)
                .firstName("Jan")
                .lastName("Novak")
                .email("landlord@test.com")
                .build();

        reservation = Reservation.builder()
                .id(1L)
                .renter(renter)
                .totalPrice(BigDecimal.valueOf(1000))
                .status(ReservationStatus.APPROVED)
                .checkIn(LocalDate.now().plusDays(5))
                .checkOut(LocalDate.now().plusDays(10))
                .build();
    }

    @Test
    void shouldCalculateCommission_as10PercentOfAmount() {
        BigDecimal amount = BigDecimal.valueOf(1000);

        BigDecimal commission = paymentService.calculateCommission(amount);

        assertEquals(BigDecimal.valueOf(100.0), commission);
    }

    @Test
    void shouldCalculateLandlordPayout_as90PercentOfAmount() {
        BigDecimal amount = BigDecimal.valueOf(1000);

        BigDecimal payout = paymentService.calculateLandlordPayout(amount);

        assertEquals(BigDecimal.valueOf(900.0), payout);
    }


    @Test
    void shouldCreatePayment_withPendingStatus() {
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");

        assertNotNull(result);
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals(BigDecimal.valueOf(1000), result.getAmount());
        assertNotNull(result.getTransactionId());
        assertNotNull(result.getReceiptNumber());
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void shouldSetCorrectCommissionAndPayout_whenProcessingPayment() {
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");

        assertEquals(BigDecimal.valueOf(100.0), result.getCommission());
        assertEquals(BigDecimal.valueOf(900.0), result.getLandlordPayout());
    }

    @Test
    void shouldRefundPayment_whenCancelled() {
        Payment payment = Payment.builder()
                .id(1L)
                .amount(BigDecimal.valueOf(1000))
                .status(PaymentStatus.COMPLETED)
                .build();
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = paymentService.refundPayment(payment);

        assertEquals(PaymentStatus.REFUNDED, result.getStatus());
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void shouldThrowException_whenRefundingAlreadyRefundedPayment() {
        Payment payment = Payment.builder()
                .id(1L)
                .status(PaymentStatus.REFUNDED)
                .build();

        assertThrows(PaymentException.class, () ->
                paymentService.refundPayment(payment));
    }


    @Test
    void shouldGenerateUniqueTransactionIds_forEachPayment() {
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment payment1 = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");
        Payment payment2 = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");

        assertNotEquals(payment1.getTransactionId(), payment2.getTransactionId());
    }


    @Test
    void shouldGenerateReceipt_withCorrectDetails() {
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");

        assertNotNull(result.getReceiptNumber());
        assertNotNull(result.getPaidAt());
        assertEquals("4242", result.getCardLastFour());
        assertEquals("VISA", result.getCardBrand());
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals(BigDecimal.valueOf(1000), result.getAmount());
        assertEquals(BigDecimal.valueOf(100.0), result.getCommission());
        assertEquals(BigDecimal.valueOf(900.0), result.getLandlordPayout());
    }

    @Test
    void shouldHaveUniqueReceiptNumber_forEachPayment() {
        when(paymentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment payment1 = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");
        Payment payment2 = paymentService.processPayment(
                reservation, landlord, "4242", "VISA");

        assertNotEquals(payment1.getReceiptNumber(), payment2.getReceiptNumber());
    }
}


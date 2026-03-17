package com.stayflow.backend.web.payment;

import com.stayflow.backend.common.exception.user.UnauthorizedException;
import com.stayflow.backend.domain.payment.Payment;
import com.stayflow.backend.domain.payment.PaymentService;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.payment.dto.PaymentRequest;
import com.stayflow.backend.web.payment.dto.PaymentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final ReservationService reservationService;
    private final EmailService emailService;

    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<PaymentResponse> pay(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PaymentRequest request) {
        Reservation reservation = reservationService.getById(request.getReservationId());

        if (!reservation.getRenter().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only pay for your own reservations");
        }

        Payment payment = paymentService.processPayment(
                reservation,
                reservation.getApartment().getLandlord(),
                request.getCardLastFour(),
                request.getCardBrand()
        );
        emailService.sendPaymentReceiptToRenter(payment.getRenter().getEmail(), payment);
        emailService.sendPaymentReceiptToLandlord(payment.getLandlord().getEmail(), payment);
        return ResponseEntity.ok(PaymentResponse.from(payment));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal User user) {
        List<PaymentResponse> payments = paymentService
                .getRenterPayments(user.getId())
                .stream()
                .map(PaymentResponse::from)
                .toList();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<PaymentResponse>> getLandlordPayments(
            @AuthenticationPrincipal User user) {
        List<PaymentResponse> payments = paymentService
                .getLandlordPayments(user.getId())
                .stream()
                .map(PaymentResponse::from)
                .toList();
        return ResponseEntity.ok(payments);
    }
}
package com.stayflow.backend.domain.payment;

import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private static final BigDecimal COMMISSION_RATE = BigDecimal.valueOf(0.10);

    public Payment processPayment(Reservation reservation, User landlord,
                                  String cardLastFour, String cardBrand) {
        BigDecimal amount = reservation.getTotalPrice();
        BigDecimal commission = calculateCommission(amount);
        BigDecimal landlordPayout = calculateLandlordPayout(amount);

        Payment payment = Payment.builder()
                .reservation(reservation)
                .renter(reservation.getRenter())
                .landlord(landlord)
                .amount(amount)
                .commission(commission)
                .landlordPayout(landlordPayout)
                .status(PaymentStatus.COMPLETED)
                .cardLastFour(cardLastFour)
                .cardBrand(cardBrand)
                .transactionId(generateTransactionId())
                .receiptNumber(generateReceiptNumber())
                .paidAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    public Payment refundPayment(Payment payment) {
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException("Payment is already refunded");
        }
        payment.setStatus(PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }

    public BigDecimal calculateCommission(BigDecimal amount) {
        return amount.multiply(COMMISSION_RATE)
                .setScale(1, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateLandlordPayout(BigDecimal amount) {
        return amount.subtract(calculateCommission(amount))
                .setScale(1, RoundingMode.HALF_UP);
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().toUpperCase();
    }

    private String generateReceiptNumber() {
        return "RCP-" + UUID.randomUUID().toString().toUpperCase();
    }
}
package com.stayflow.backend.domain.payment;

import com.stayflow.backend.common.exception.payment.PaymentException;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationRepository;
import com.stayflow.backend.domain.reservation.ReservationStatus;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    private static final BigDecimal COMMISSION_RATE = BigDecimal.valueOf(0.10);

    public Payment processPayment(Reservation reservation, User landlord,
                                  String cardLastFour, String cardBrand) {
        if (reservation.getStatus() == ReservationStatus.PAID) {
            throw new PaymentException("Reservation is already paid");
        }

        if (reservation.getStatus() != ReservationStatus.APPROVED) {
            throw new PaymentException("Reservation must be approved before payment");
        }

        Payment payment = buildPayment(reservation, landlord, cardLastFour, cardBrand);
        Payment saved = paymentRepository.save(payment);

        reservation.setStatus(ReservationStatus.PAID);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        return saved;
    }

    public Payment refundPayment(Payment payment) {
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new PaymentException("Payment is already refunded");
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

    private Payment buildPayment(Reservation reservation, User landlord,
                                 String cardLastFour, String cardBrand) {
        BigDecimal amount = reservation.getTotalPrice();
        return Payment.builder()
                .reservation(reservation)
                .renter(reservation.getRenter())
                .landlord(landlord)
                .amount(amount)
                .commission(calculateCommission(amount))
                .landlordPayout(calculateLandlordPayout(amount))
                .status(PaymentStatus.COMPLETED)
                .cardLastFour(cardLastFour)
                .cardBrand(cardBrand)
                .transactionId(generateTransactionId())
                .receiptNumber(generateReceiptNumber())
                .paidAt(LocalDateTime.now())
                .build();
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().toUpperCase();
    }

    private String generateReceiptNumber() {
        return "RCP-" + UUID.randomUUID().toString().toUpperCase();
    }

    public List<Payment> getRenterPayments(Long renterId) {
        return paymentRepository.findByRenterId(renterId);
    }

    public List<Payment> getLandlordPayments(Long landlordId) {
        return paymentRepository.findByLandlordId(landlordId);
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public long countAll() {
        return paymentRepository.count();
    }

    public BigDecimal getTotalRevenue() {
        return paymentRepository.sumAmount();
    }

    public BigDecimal getTotalCommission() {
        return paymentRepository.sumCommission();
    }
}
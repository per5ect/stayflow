package com.stayflow.backend.web.payment.dto;

import com.stayflow.backend.domain.payment.Payment;
import com.stayflow.backend.domain.payment.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long reservationId;
    private String apartmentTitle;
    private String renterName;
    private BigDecimal amount;
    private BigDecimal commission;
    private BigDecimal landlordPayout;
    private PaymentStatus status;
    private String cardBrand;
    private String cardLastFour;
    private String transactionId;
    private String receiptNumber;
    private LocalDateTime paidAt;

    public static PaymentResponse from(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .reservationId(payment.getReservation().getId())
                .apartmentTitle(payment.getReservation().getApartment().getTitle())
                .renterName(payment.getRenter().getFirstName()
                        + " " + payment.getRenter().getLastName())
                .amount(payment.getAmount())
                .commission(payment.getCommission())
                .landlordPayout(payment.getLandlordPayout())
                .status(payment.getStatus())
                .cardBrand(payment.getCardBrand())
                .cardLastFour(payment.getCardLastFour())
                .transactionId(payment.getTransactionId())
                .receiptNumber(payment.getReceiptNumber())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
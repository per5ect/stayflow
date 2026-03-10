package com.stayflow.backend.web.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Reservation ID is required")
    private Long reservationId;

    @NotBlank(message = "Card last four digits are required")
    @Size(min = 4, max = 4, message = "Card last four must be exactly 4 digits")
    private String cardLastFour;

    @NotBlank(message = "Card brand is required")
    private String cardBrand;
}
package com.stayflow.backend.web.reservation.dto;

import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private Long apartmentId;
    private String apartmentTitle;
    private String apartmentCity;
    private String renterName;
    private String landlordName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer nights;
    private BigDecimal totalPrice;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .apartmentId(reservation.getApartment().getId())
                .apartmentTitle(reservation.getApartment().getTitle())
                .apartmentCity(reservation.getApartment().getCity())
                .renterName(reservation.getRenter().getFirstName()
                        + " " + reservation.getRenter().getLastName())
                .landlordName(reservation.getApartment().getLandlord().getFirstName()
                        + " " + reservation.getApartment().getLandlord().getLastName())
                .checkIn(reservation.getCheckIn())
                .checkOut(reservation.getCheckOut())
                .nights((int) reservation.getCheckIn()
                        .until(reservation.getCheckOut(),
                                java.time.temporal.ChronoUnit.DAYS))
                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
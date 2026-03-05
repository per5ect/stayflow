package com.stayflow.backend.domain.reservation;

import com.stayflow.backend.common.exception.InvalidReservationException;
import com.stayflow.backend.common.exception.ReservationConflictException;
import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentStatus;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public Reservation createReservation(User renter, Apartment apartment,
                                         LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new InvalidReservationException("Dates are required");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Check-out must be after check-in");
        }
        if (apartment.getStatus() != ApartmentStatus.ACTIVE) {
            throw new InvalidReservationException("Apartment is not available");
        }
        if (apartment.getLandlord().getId().equals(renter.getId())) {
            throw new InvalidReservationException("Cannot book own apartment");
        }
        if (reservationRepository.existsOverlapping(apartment.getId(), checkIn, checkOut)) {
            throw new ReservationConflictException("Already booked for these dates");
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal total = apartment.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        if (nights >= 7) {
            total = total.subtract(total.multiply(BigDecimal.valueOf(0.10)));
        }

        return reservationRepository.save(Reservation.builder()
                .renter(renter)
                .apartment(apartment)
                .checkIn(checkIn)
                .checkOut(checkOut)
                .totalPrice(total)
                .status(ReservationStatus.PENDING)
                .build());
    }

    public Reservation cancelReservation(Reservation reservation) {
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new InvalidReservationException("Already cancelled");
        }
        if (ChronoUnit.HOURS.between(LocalDate.now().atStartOfDay(),
                reservation.getCheckIn().atStartOfDay()) < 24) {
            throw new InvalidReservationException("Cannot cancel less than 24 hours before check-in");
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public BigDecimal calculatePrice(BigDecimal pricePerNight,
                                     LocalDate checkIn, LocalDate checkOut) {
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal total = pricePerNight.multiply(BigDecimal.valueOf(nights));
        if (nights >= 7) {
            total = total.subtract(total.multiply(BigDecimal.valueOf(0.10)));
        }
        return total;
    }
}

package com.stayflow.backend.domain.reservation;

import com.stayflow.backend.common.exception.user.UnauthorizedException;
import com.stayflow.backend.common.exception.reservation.InvalidReservationException;
import com.stayflow.backend.common.exception.reservation.ReservationConflictException;
import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentStatus;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public Reservation createReservation(User renter, Apartment apartment,
                                         LocalDate checkIn, LocalDate checkOut) {
        validateDates(checkIn, checkOut);
        validateApartmentAvailable(apartment);
        validateNotOwnApartment(renter, apartment);
        validateNoDatesOverlap(apartment.getId(), checkIn, checkOut);

        BigDecimal totalPrice = calculatePrice(apartment.getPricePerNight(), checkIn, checkOut);

        Reservation reservation = Reservation.builder()
                .renter(renter)
                .apartment(apartment)
                .checkIn(checkIn)
                .checkOut(checkOut)
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING)
                .build();

        return reservationRepository.save(reservation);
    }

    public Reservation cancelReservation(Reservation reservation , User renter) {
        if (!reservation.getRenter().getId().equals(renter.getId())) {
            throw new UnauthorizedException("You can only cancel your own reservations");
        }
        validateCancellable(reservation);
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public BigDecimal calculatePrice(BigDecimal pricePerNight,
                                     LocalDate checkIn, LocalDate checkOut) {
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal total = pricePerNight.multiply(BigDecimal.valueOf(nights));

        if (nights >= 7) {
            BigDecimal discount = total.multiply(BigDecimal.valueOf(0.10));
            total = total.subtract(discount);
        }

        return total;
    }


    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new InvalidReservationException("Check-in and check-out dates are required");
        }
        if (!checkOut.isAfter(checkIn.plusDays(0))) {
            throw new InvalidReservationException("Check-out must be after check-in");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Check-out must be at least 1 day after check-in");
        }
    }

    private void validateApartmentAvailable(Apartment apartment) {
        if (apartment.getStatus() != ApartmentStatus.ACTIVE) {
            throw new InvalidReservationException("Apartment is not available for booking");
        }
    }

    private void validateNotOwnApartment(User renter, Apartment apartment) {
        if (apartment.getLandlord().getId().equals(renter.getId())) {
            throw new InvalidReservationException("Landlord cannot book their own apartment");
        }
    }

    private void validateNoDatesOverlap(Long apartmentId,
                                        LocalDate checkIn, LocalDate checkOut) {
        if (reservationRepository.existsOverlapping(apartmentId, checkIn, checkOut)) {
            throw new ReservationConflictException("Apartment is already booked for these dates");
        }
    }

    private void validateCancellable(Reservation reservation) {
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new InvalidReservationException("Reservation is already cancelled");
        }
        LocalDate today = LocalDate.now();
        if (ChronoUnit.HOURS.between(today.atStartOfDay(),
                reservation.getCheckIn().atStartOfDay()) < 24) {
            throw new InvalidReservationException(
                    "Cannot cancel reservation less than 24 hours before check-in");
        }
    }

    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new InvalidReservationException("Reservation not found"));
    }

    public List<Reservation> getRenterReservations(Long renterId) {
        return reservationRepository.findByRenterId(renterId);
    }

    public List<Reservation> getLandlordReservations(Long landlordId) {
        return reservationRepository.findByApartmentLandlordId(landlordId);
    }

    public Reservation approveReservation(Reservation reservation, User landlord, String message) {
        if (!reservation.getApartment().getLandlord().getId().equals(landlord.getId())) {
            throw new UnauthorizedException("You can only approve reservations for your apartments");
        }
        reservation.setStatus(ReservationStatus.APPROVED);
        reservation.setLandlordMessage(message);
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public Reservation declineReservation(Reservation reservation, User landlord, String message) {
        if (!reservation.getApartment().getLandlord().getId().equals(landlord.getId())) {
            throw new UnauthorizedException("You can only decline reservations for your apartments");
        }
        reservation.setStatus(ReservationStatus.DECLINED);
        reservation.setLandlordMessage(message);
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public long countAll() {
        return reservationRepository.count();
    }

    public long countByStatus(String status) {
        return reservationRepository.countByStatus(ReservationStatus.valueOf(status));
    }

    public Page<Reservation> findByRenterWithFilters(Long renterId, String status, Pageable pageable) {
        return reservationRepository.findByRenterIdWithFilters(
                renterId,
                status,
                pageable);
    }

    public Page<Reservation> findByLandlordWithFilters(Long landlordId, String status, Pageable pageable) {
        return reservationRepository.findByLandlordIdWithFilters(
                landlordId,
                status,
                pageable);
    }

    public Page<Reservation> findAllWithFilters(String status, Pageable pageable) {
        return reservationRepository.findAllWithFilters(
                status,
                pageable);
    }
}

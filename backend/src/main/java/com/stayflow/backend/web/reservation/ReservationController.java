package com.stayflow.backend.web.reservation;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.web.reservation.dto.ReservationRequest;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ApartmentService apartmentService;


    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ReservationResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReservationRequest request) {
        Apartment apartment = apartmentService.getById(request.getApartmentId());
        Reservation reservation = reservationService.createReservation(
                user, apartment,
                request.getCheckIn(),
                request.getCheckOut()
        );
        return ResponseEntity.ok(ReservationResponse.from(reservation));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal User user) {
        List<ReservationResponse> reservations = reservationService
                .getRenterReservations(user.getId())
                .stream()
                .map(ReservationResponse::from)
                .toList();
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<String> cancel(
            @PathVariable Long id) {
        Reservation reservation = reservationService.getById(id);
        reservationService.cancelReservation(reservation);
        return ResponseEntity.ok("Reservation cancelled successfully!");
    }


    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<ReservationResponse>> getLandlordReservations(
            @AuthenticationPrincipal User user) {
        List<ReservationResponse> reservations = reservationService
                .getLandlordReservations(user.getId())
                .stream()
                .map(ReservationResponse::from)
                .toList();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ReservationResponse> approve(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam(required = false) String message) {
        Reservation reservation = reservationService.getById(id);
        Reservation approved = reservationService.approveReservation(reservation, user, message);
        return ResponseEntity.ok(ReservationResponse.from(approved));
    }

    @PutMapping("/{id}/decline")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ReservationResponse> decline(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam(required = false) String message) {
        Reservation reservation = reservationService.getById(id);
        Reservation declined = reservationService.declineReservation(reservation, user, message);
        return ResponseEntity.ok(ReservationResponse.from(declined));
    }
}
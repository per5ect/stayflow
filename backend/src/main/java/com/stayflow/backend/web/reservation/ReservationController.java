package com.stayflow.backend.web.reservation;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.reservation.Reservation;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.common.SortUtils;
import com.stayflow.backend.web.reservation.dto.ReservationRequest;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ApartmentService apartmentService;
    private final EmailService emailService;


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
    public ResponseEntity<Page<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.RESERVATION_SORT_FIELDS);
        Page<ReservationResponse> reservations = reservationService
                .findByRenterWithFilters(user.getId(), status, PageRequest.of(page, size, sort))
                .map(ReservationResponse::from);
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<String> cancel(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Reservation reservation = reservationService.getById(id);
        reservationService.cancelReservation(reservation, user);
        return ResponseEntity.ok("Reservation cancelled successfully!");
    }


    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Page<ReservationResponse>> getLandlordReservations(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.RESERVATION_SORT_FIELDS);
        Page<ReservationResponse> reservations = reservationService
                .findByLandlordWithFilters(user.getId(), status, PageRequest.of(page, size, sort))
                .map(ReservationResponse::from);
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
        emailService.sendReservationApproved(
                approved.getRenter().getEmail(),
                approved.getApartment().getTitle(),
                message
        );
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
        emailService.sendReservationDeclined(
                declined.getRenter().getEmail(),
                declined.getApartment().getTitle(),
                message
        );
        return ResponseEntity.ok(ReservationResponse.from(declined));
    }
}
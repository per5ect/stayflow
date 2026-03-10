package com.stayflow.backend.web.admin;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.payment.PaymentService;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserService;
import com.stayflow.backend.web.admin.dto.AdminStatsResponse;
import com.stayflow.backend.web.admin.dto.AdminUserResponse;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.payment.dto.PaymentResponse;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ApartmentService apartmentService;
    private final ReservationService reservationService;
    private final PaymentService paymentService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(AdminStatsResponse.builder()
                .totalUsers(userService.countAll())
                .totalLandlords(userService.countByRole("LANDLORD"))
                .totalRenters(userService.countByRole("RENTER"))
                .totalApartments(apartmentService.countAll())
                .activeApartments(apartmentService.countActive())
                .totalReservations(reservationService.countAll())
                .pendingReservations(reservationService.countByStatus("PENDING"))
                .approvedReservations(reservationService.countByStatus("APPROVED"))
                .totalPayments(paymentService.countAll())
                .totalRevenue(paymentService.getTotalRevenue())
                .totalCommission(paymentService.getTotalCommission())
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll()
                .stream()
                .map(AdminUserResponse::from)
                .toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @GetMapping("/apartments")
    public ResponseEntity<List<ApartmentResponse>> getAllApartments() {
        return ResponseEntity.ok(apartmentService.findAll()
                .stream()
                .map(ApartmentResponse::from)
                .toList());
    }

    @PutMapping("/apartments/{id}/deactivate")
    public ResponseEntity<ApartmentResponse> deactivateApartment(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id) {
        Apartment apartment = apartmentService.getById(id);
        Apartment deactivated = apartmentService.deactivateApartment(apartment, admin);
        return ResponseEntity.ok(ApartmentResponse.from(deactivated));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.findAll()
                .stream()
                .map(ReservationResponse::from)
                .toList());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll()
                .stream()
                .map(PaymentResponse::from)
                .toList());
    }
}
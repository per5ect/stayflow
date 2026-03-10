package com.stayflow.backend.web.admin;

import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.payment.PaymentService;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.UserService;
import com.stayflow.backend.web.admin.dto.AdminStatsResponse;
import com.stayflow.backend.web.admin.dto.AdminUserResponse;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.common.SortUtils;
import com.stayflow.backend.web.payment.dto.PaymentResponse;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.USER_SORT_FIELDS);
        Page<AdminUserResponse> users = userService
                .findAllWithFilters(role, email, PageRequest.of(page, size, sort))
                .map(AdminUserResponse::from);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @GetMapping("/apartments")
    public ResponseEntity<Page<ApartmentResponse>> getAllApartments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.APARTMENT_SORT_FIELDS);
        Page<ApartmentResponse> apartments = apartmentService
                .findAllWithFilters(status, city, PageRequest.of(page, size, sort))
                .map(ApartmentResponse::from);
        return ResponseEntity.ok(apartments);
    }

    @GetMapping("/reservations")
    public ResponseEntity<Page<ReservationResponse>> getAllReservations(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.RESERVATION_SORT_FIELDS);
        Page<ReservationResponse> reservations = reservationService
                .findAllWithFilters(status, PageRequest.of(page, size, sort))
                .map(ReservationResponse::from);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/payments")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paidAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.PAYMENT_SORT_FIELDS);
        Page<PaymentResponse> payments = paymentService
                .findAllWithFilters(status, PageRequest.of(page, size, sort))
                .map(PaymentResponse::from);
        return ResponseEntity.ok(payments);
    }
}
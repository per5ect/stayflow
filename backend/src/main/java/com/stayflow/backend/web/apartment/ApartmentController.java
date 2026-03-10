package com.stayflow.backend.web.apartment;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @GetMapping
    public ResponseEntity<List<ApartmentResponse>> getAll() {
        List<ApartmentResponse> apartments = apartmentService
                .getAllActive()
                .stream()
                .map(ApartmentResponse::from)
                .toList();
        return ResponseEntity.ok(apartments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApartmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApartmentResponse.from(apartmentService.getById(id)));
    }


    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ApartmentRequest request) {
        Apartment apartment = apartmentService.createApartment(
                user,
                request.getTitle(),
                request.getDescription(),
                request.getPricePerNight(),
                request.getStreet(),
                request.getCity(),
                request.getCountry(),
                request.getRoomsCount(),
                request.getApartmentType()
        );
        return ResponseEntity.ok(ApartmentResponse.from(apartment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ApartmentRequest request) {
        Apartment apartment = apartmentService.getById(id);
        Apartment updated = apartmentService.updateApartment(
                apartment,
                user,
                request.getTitle(),
                request.getDescription(),
                request.getPricePerNight(),
                request.getRoomsCount()
        );
        return ResponseEntity.ok(ApartmentResponse.from(updated));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> deactivate(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Apartment apartment = apartmentService.getById(id);
        Apartment deactivated = apartmentService.deactivateApartment(apartment, user);
        return ResponseEntity.ok(ApartmentResponse.from(deactivated));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> activate(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Apartment apartment = apartmentService.getById(id);
        Apartment activated = apartmentService.activateApartment(apartment, user);
        return ResponseEntity.ok(ApartmentResponse.from(activated));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<ApartmentResponse>> getMyApartments(
            @AuthenticationPrincipal User user) {
        List<ApartmentResponse> apartments = apartmentService
                .getLandlordApartments(user.getId())
                .stream()
                .map(ApartmentResponse::from)
                .toList();
        return ResponseEntity.ok(apartments);
    }
}
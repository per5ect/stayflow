package com.stayflow.backend.web.apartment;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentService;
import com.stayflow.backend.domain.apartment.ApartmentType;
import com.stayflow.backend.domain.reservation.ReservationService;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.infrastructure.storage.CloudinaryService;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.apartment.dto.AvailabilityResponse;
import com.stayflow.backend.web.apartment.dto.BookedRangeResponse;
import com.stayflow.backend.web.common.SortUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;
    private final CloudinaryService cloudinaryService;
    private final ReservationService reservationService;


    @GetMapping
    public ResponseEntity<Page<ApartmentResponse>> getAll(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minRooms,
            @RequestParam(required = false) ApartmentType type,
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.APARTMENT_SORT_FIELDS);

        Page<ApartmentResponse> apartments = apartmentService
                .findWithFilters(city, minPrice, maxPrice, minRooms, type,
                        checkIn, checkOut, PageRequest.of(page, size, sort))
                .map(ApartmentResponse::from);
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
    public ResponseEntity<Page<ApartmentResponse>> getMyApartments(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = SortUtils.buildSort(sortBy, sortDir, SortUtils.APARTMENT_SORT_FIELDS);
        Page<ApartmentResponse> apartments = apartmentService
                .findByLandlordWithFilters(user.getId(), status, PageRequest.of(page, size, sort))
                .map(ApartmentResponse::from);
        return ResponseEntity.ok(apartments);
    }

    @PostMapping("/{id}/availability")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> addAvailability(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        Apartment apartment = apartmentService.getById(id);
        apartmentService.addAvailability(apartment, user, from, to);
        return ResponseEntity.ok("Availability added successfully!");
    }

    @DeleteMapping("/{id}/availability/{availabilityId}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> removeAvailability(
            @AuthenticationPrincipal User user,
            @PathVariable Long availabilityId) {
        apartmentService.removeAvailability(availabilityId, user);
        return ResponseEntity.ok("Availability removed successfully!");
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                apartmentService.getAvailability(id).stream()
                        .map(AvailabilityResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{id}/booked-dates")
    public ResponseEntity<List<BookedRangeResponse>> getBookedDates(@PathVariable Long id) {
        return ResponseEntity.ok(
            reservationService.getBookedRanges(id).stream()
                .map(r -> new BookedRangeResponse(r.getCheckIn(), r.getCheckOut()))
                .toList()
        );
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> addPhotos(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        Apartment apartment = apartmentService.getById(id);
        List<String> urls = cloudinaryService.uploadImages(files, "apartments/" + id);
        Apartment updated = apartmentService.addPhotos(apartment, user, urls);
        return ResponseEntity.ok(ApartmentResponse.from(updated));
    }

    @DeleteMapping("/{id}/photos")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<ApartmentResponse> deletePhoto(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam String photoUrl) {
        Apartment apartment = apartmentService.getById(id);
        cloudinaryService.deleteImage(photoUrl);
        Apartment updated = apartmentService.deletePhoto(apartment, user, photoUrl);
        return ResponseEntity.ok(ApartmentResponse.from(updated));
    }
}
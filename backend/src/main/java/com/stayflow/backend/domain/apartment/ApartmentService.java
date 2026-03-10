package com.stayflow.backend.domain.apartment;

import com.stayflow.backend.common.exception.apartment.ApartmentAvailabilityNotFoundException;
import com.stayflow.backend.common.exception.apartment.ApartmentNotFoundException;
import com.stayflow.backend.common.exception.apartment.InvalidApartmentDataException;
import com.stayflow.backend.common.exception.user.UnauthorizedException;
import com.stayflow.backend.domain.reservation.ReservationRepository;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentAvailableDatesRepository apartmentAvailableDatesRepository;
    private final ReservationRepository reservationRepository;

    public Apartment createApartment(User landlord, String title, String description,
                                     BigDecimal pricePerNight, String street, String city,
                                     String country, Integer roomsCount,
                                     ApartmentType apartmentType) {
        validateApartmentData(pricePerNight, roomsCount);

        Apartment apartment = Apartment.builder()
                .landlord(landlord)
                .title(title)
                .description(description)
                .pricePerNight(pricePerNight)
                .street(street)
                .city(city)
                .country(country)
                .roomsCount(roomsCount)
                .apartmentType(apartmentType)
                .status(ApartmentStatus.ACTIVE)
                .build();

        return apartmentRepository.save(apartment);
    }

    public Apartment getById(Long id) {
        return apartmentRepository.findById(id)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found"));
    }

    public Apartment updateApartment(Apartment apartment, User user, String title,
                                     String description, BigDecimal pricePerNight,
                                     Integer roomsCount) {
        validateOwnership(apartment, user);
        validateApartmentData(pricePerNight, roomsCount);

        apartment.setTitle(title);
        apartment.setDescription(description);
        apartment.setPricePerNight(pricePerNight);
        apartment.setRoomsCount(roomsCount);
        apartment.setUpdatedAt(LocalDateTime.now());

        return apartmentRepository.save(apartment);
    }

    public Apartment deactivateApartment(Apartment apartment, User user) {
        validateOwnership(apartment, user);
        apartment.setStatus(ApartmentStatus.INACTIVE);
        apartment.setUpdatedAt(LocalDateTime.now());
        return apartmentRepository.save(apartment);
    }

    public Apartment activateApartment(Apartment apartment, User user) {
        validateOwnership(apartment, user);
        apartment.setStatus(ApartmentStatus.ACTIVE);
        apartment.setUpdatedAt(LocalDateTime.now());
        return apartmentRepository.save(apartment);
    }


    private void validateOwnership(Apartment apartment, User user) {
        if (!apartment.getLandlord().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not the owner of this apartment");
        }
    }

    private void validateApartmentData(BigDecimal pricePerNight, Integer roomsCount) {
        if (pricePerNight.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidApartmentDataException("Price must be greater than zero");
        }
        if (roomsCount <= 0) {
            throw new InvalidApartmentDataException("Rooms count must be greater than zero");
        }
    }

    public List<Apartment> getAllActive() {
        return apartmentRepository.findByStatus(ApartmentStatus.ACTIVE);
    }

    public List<Apartment> findAll() {
        return apartmentRepository.findAll();
    }

    public long countAll() {
        return apartmentRepository.count();
    }

    public long countActive() {
        return apartmentRepository.countByStatus(ApartmentStatus.ACTIVE);
    }

    public Page<Apartment> findWithFilters(String city, BigDecimal minPrice,
                                            BigDecimal maxPrice, Integer minRooms,
                                            ApartmentType type, LocalDate checkIn,
                                            LocalDate checkOut, Pageable pageable) {
        if (checkIn == null || checkOut == null) {
            return apartmentRepository.findWithFilters(
                    city, minPrice, maxPrice, minRooms,
                    type != null ? type.name() : null,
                    pageable);
        }

        List<Apartment> all = apartmentRepository.findWithFilters(
                city, minPrice, maxPrice, minRooms,
                type != null ? type.name() : null,
                Pageable.unpaged()).getContent();

        List<Apartment> filtered = all.stream()
                .filter(a -> {
                    boolean available = apartmentAvailableDatesRepository.existsAvailability(
                            a.getId(), checkIn, checkOut);
                    boolean noConflict = !reservationRepository.existsOverlapping(
                            a.getId(), checkIn, checkOut);
                    return available && noConflict;
                })
                .toList();


        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        List<Apartment> page = start >= filtered.size() ? List.of() : filtered.subList(start, end);

        return new PageImpl<>(page, pageable, filtered.size());
    }

    public Page<Apartment> findByLandlordWithFilters(Long landlordId, String status, Pageable pageable) {
        return apartmentRepository.findByLandlordIdWithFilters(
                landlordId,
                status,
                pageable);
    }

    public Page<Apartment> findAllWithFilters(String status, String city, Pageable pageable) {
        return apartmentRepository.findAllWithFilters(
                status,
                city,
                pageable);
    }

    public ApartmentAvailableDates addAvailability(Apartment apartment, User landlord,
                                                   LocalDate from, LocalDate to) {
        if (!apartment.getLandlord().getId().equals(landlord.getId())) {
            throw new UnauthorizedException("You can only add availability for your apartments");
        }
        if (from.isAfter(to)) {
            throw new InvalidApartmentDataException("Available from must be before available to");
        }
        ApartmentAvailableDates dates = ApartmentAvailableDates.builder()
                .apartment(apartment)
                .availableFrom(from)
                .availableTo(to)
                .build();
        return apartmentAvailableDatesRepository.save(dates);
    }

    public void removeAvailability(Long availabilityId, User landlord) {
        ApartmentAvailableDates dates = apartmentAvailableDatesRepository.findById(availabilityId)
                .orElseThrow(() -> new ApartmentAvailabilityNotFoundException("Availability not found"));
        if (!dates.getApartment().getLandlord().getId().equals(landlord.getId())) {
            throw new UnauthorizedException("You can only remove availability for your apartments");
        }
        apartmentAvailableDatesRepository.delete(dates);
    }

    public List<ApartmentAvailableDates> getAvailability(Long apartmentId) {
        return apartmentAvailableDatesRepository.findByApartmentId(apartmentId);
    }
}
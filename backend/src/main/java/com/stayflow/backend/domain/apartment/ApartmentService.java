package com.stayflow.backend.domain.apartment;

import com.stayflow.backend.common.exception.apartment.ApartmentNotFoundException;
import com.stayflow.backend.common.exception.apartment.InvalidApartmentDataException;
import com.stayflow.backend.common.exception.apartment.UnauthorizedException;
import com.stayflow.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;

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

    public List<Apartment> getLandlordApartments(Long landlordId) {
        return apartmentRepository.findByLandlordId(landlordId);
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
}
package com.stayflow.backend.domain.apartment;

import com.stayflow.backend.common.exception.apartment.ApartmentNotFoundException;
import com.stayflow.backend.common.exception.apartment.InvalidApartmentDataException;
import com.stayflow.backend.common.exception.apartment.UnauthorizedException;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApartmentServiceTest {

    @Mock
    private ApartmentRepository apartmentRepository;

    @InjectMocks
    private ApartmentService apartmentService;

    private User landlord;
    private User otherUser;
    private Apartment apartment;

    @BeforeEach
    void setUp() {
        landlord = User.builder()
                .id(1L)
                .firstName("Jan")
                .lastName("Novak")
                .email("landlord@test.com")
                .role(UserRole.LANDLORD)
                .build();

        otherUser = User.builder()
                .id(99L)
                .firstName("Other")
                .lastName("User")
                .email("other@test.com")
                .role(UserRole.RENTER)
                .build();

        apartment = Apartment.builder()
                .id(1L)
                .landlord(landlord)
                .title("Nice apartment")
                .description("Great place")
                .pricePerNight(BigDecimal.valueOf(100))
                .street("Hlavni 1")
                .city("Praha")
                .country("Czech Republic")
                .roomsCount(2)
                .apartmentType(ApartmentType.APARTMENT)
                .status(ApartmentStatus.ACTIVE)
                .build();
    }

    @Test
    void shouldCreateApartment_whenDataIsValid() {
        when(apartmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Apartment result = apartmentService.createApartment(
                landlord, "Nice apartment", "Great place",
                BigDecimal.valueOf(100), "Hlavni 1", "Praha",
                "Czech Republic", 2, ApartmentType.APARTMENT);

        assertNotNull(result);
        assertEquals("Nice apartment", result.getTitle());
        assertEquals(ApartmentStatus.ACTIVE, result.getStatus());
        assertEquals(landlord, result.getLandlord());
        verify(apartmentRepository).save(any(Apartment.class));
    }

    @Test
    void shouldThrowException_whenPriceIsZero() {
        assertThrows(InvalidApartmentDataException.class, () ->
                apartmentService.createApartment(
                        landlord, "Nice apartment", "Great place",
                        BigDecimal.ZERO, "Hlavni 1", "Praha",
                        "Czech Republic", 2, ApartmentType.APARTMENT));
    }

    @Test
    void shouldThrowException_whenPriceIsNegative() {
        assertThrows(InvalidApartmentDataException.class, () ->
                apartmentService.createApartment(
                        landlord, "Nice apartment", "Great place",
                        BigDecimal.valueOf(-1), "Hlavni 1", "Praha",
                        "Czech Republic", 2, ApartmentType.APARTMENT));
    }

    @Test
    void shouldThrowException_whenRoomsCountIsZero() {
        assertThrows(InvalidApartmentDataException.class, () ->
                apartmentService.createApartment(
                        landlord, "Nice apartment", "Great place",
                        BigDecimal.valueOf(100), "Hlavni 1", "Praha",
                        "Czech Republic", 0, ApartmentType.APARTMENT));
    }

    @Test
    void shouldReturnApartment_whenIdExists() {
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));

        Apartment result = apartmentService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void shouldThrowException_whenApartmentNotFound() {
        when(apartmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ApartmentNotFoundException.class, () ->
                apartmentService.getById(99L));
    }

    @Test
    void shouldUpdateApartment_whenLandlordIsOwner() {
        when(apartmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Apartment result = apartmentService.updateApartment(
                apartment, landlord, "Updated title", "New description",
                BigDecimal.valueOf(150), 3);

        assertEquals("Updated title", result.getTitle());
        assertEquals(BigDecimal.valueOf(150), result.getPricePerNight());
        assertEquals(3, result.getRoomsCount());
    }

    @Test
    void shouldThrowException_whenNonOwnerTriesToUpdate() {
        assertThrows(UnauthorizedException.class, () ->
                apartmentService.updateApartment(
                        apartment, otherUser, "Updated title",
                        "New description", BigDecimal.valueOf(150), 3));
    }

    @Test
    void shouldDeactivateApartment_whenLandlordIsOwner() {
        when(apartmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Apartment result = apartmentService.deactivateApartment(apartment, landlord);

        assertEquals(ApartmentStatus.INACTIVE, result.getStatus());
    }

    @Test
    void shouldActivateApartment_whenLandlordIsOwner() {
        apartment.setStatus(ApartmentStatus.INACTIVE);
        when(apartmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Apartment result = apartmentService.activateApartment(apartment, landlord);

        assertEquals(ApartmentStatus.ACTIVE, result.getStatus());
    }

    @Test
    void shouldThrowException_whenNonOwnerTriesToDeactivate() {
        assertThrows(UnauthorizedException.class, () ->
                apartmentService.deactivateApartment(apartment, otherUser));
    }

    @Test
    void shouldReturnOnlyActiveApartments() {
        when(apartmentRepository.findByStatus(ApartmentStatus.ACTIVE))
                .thenReturn(List.of(Apartment.builder()
                        .id(1L)
                        .status(ApartmentStatus.ACTIVE)
                        .build()));

        List<Apartment> result = apartmentService.getAllActive();

        assertEquals(1, result.size());
        assertEquals(ApartmentStatus.ACTIVE, result.get(0).getStatus());
        verify(apartmentRepository).findByStatus(ApartmentStatus.ACTIVE);
    }

    @Test
    void shouldReturnEmpty_whenNoActiveApartments() {
        when(apartmentRepository.findByStatus(ApartmentStatus.ACTIVE))
                .thenReturn(List.of());

        List<Apartment> result = apartmentService.getAllActive();

        assertTrue(result.isEmpty());
        verify(apartmentRepository).findByStatus(ApartmentStatus.ACTIVE);
    }
}
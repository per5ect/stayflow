package com.stayflow.backend.domain.reservation;

import com.stayflow.backend.common.exception.reservation.InvalidReservationException;
import com.stayflow.backend.common.exception.reservation.ReservationConflictException;
import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentStatus;
import com.stayflow.backend.domain.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User renter;
    private User landlord;
    private Apartment apartment;

    @BeforeEach
    void setUp() {
        landlord = User.builder()
                .id(1L)
                .firstName("Jan")
                .lastName("Novak")
                .email("landlord@test.com")
                .build();

        renter = User.builder()
                .id(2L)
                .firstName("Petr")
                .lastName("Svoboda")
                .email("renter@test.com")
                .build();

        apartment = Apartment.builder()
                .id(1L)
                .landlord(landlord)
                .title("Nice apartment")
                .pricePerNight(BigDecimal.valueOf(100))
                .status(ApartmentStatus.ACTIVE)
                .build();
    }

    @Test
    void shouldThrowException_whenCheckOutIsBeforeCheckIn() {
        LocalDate checkIn = LocalDate.of(2025, 7, 10);
        LocalDate checkOut = LocalDate.of(2025, 7, 5);

        assertThrows(InvalidReservationException.class, () ->
                reservationService.createReservation(renter, apartment, checkIn, checkOut));
    }

    @Test
    void shouldThrowException_whenCheckOutEqualsCheckIn() {
        LocalDate checkIn = LocalDate.of(2025, 7, 10);
        LocalDate checkOut = LocalDate.of(2025, 7, 10);

        assertThrows(InvalidReservationException.class, () ->
                reservationService.createReservation(renter, apartment, checkIn, checkOut));
    }


    @Test
    void shouldThrowException_whenApartmentIsInactive() {
        apartment.setStatus(ApartmentStatus.INACTIVE);
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 5);

        assertThrows(InvalidReservationException.class, () ->
                reservationService.createReservation(renter, apartment, checkIn, checkOut));
    }


    @Test
    void shouldThrowException_whenLandlordTriesToBookOwnApartment() {
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 5);

        assertThrows(InvalidReservationException.class, () ->
                reservationService.createReservation(landlord, apartment, checkIn, checkOut));
    }

    @Test
    void shouldThrowException_whenDatesOverlap() {
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 10);
        when(reservationRepository.existsOverlapping(
                apartment.getId(), checkIn, checkOut)).thenReturn(true);

        assertThrows(ReservationConflictException.class, () ->
                reservationService.createReservation(renter, apartment, checkIn, checkOut));
    }

    @Test
    void shouldCreateReservation_whenAllConditionsAreMet() {
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 5);
        when(reservationRepository.existsOverlapping(any(), any(), any()))
                .thenReturn(false);
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.createReservation(
                renter, apartment, checkIn, checkOut);

        assertNotNull(result);
        assertEquals(ReservationStatus.PENDING, result.getStatus());
        assertEquals(renter, result.getRenter());
        verify(reservationRepository).save(any(Reservation.class));
    }


    @Test
    void shouldCalculateCorrectPrice_forLessThan7Nights() {
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 5); // 4 ночи

        BigDecimal price = reservationService.calculatePrice(
                BigDecimal.valueOf(100), checkIn, checkOut);

        assertEquals(BigDecimal.valueOf(400), price);
    }

    @Test
    void shouldApply10PercentDiscount_for7OrMoreNights() {
        LocalDate checkIn = LocalDate.of(2025, 7, 1);
        LocalDate checkOut = LocalDate.of(2025, 7, 8); // 7 ночей

        BigDecimal price = reservationService.calculatePrice(
                BigDecimal.valueOf(100), checkIn, checkOut);

        assertEquals(BigDecimal.valueOf(630.0), price);
    }

    @Test
    void shouldThrowException_whenCancellingLessThan24HoursBeforeCheckIn() {
        Reservation reservation = Reservation.builder()
                .id(1L)
                .checkIn(LocalDate.now())
                .status(ReservationStatus.APPROVED)
                .build();

        assertThrows(InvalidReservationException.class, () ->
                reservationService.cancelReservation(reservation));
    }

    @Test
    void shouldCancelReservation_whenMoreThan24HoursBeforeCheckIn() {
        Reservation reservation = Reservation.builder()
                .id(1L)
                .checkIn(LocalDate.now().plusDays(5))
                .status(ReservationStatus.APPROVED)
                .build();
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.cancelReservation(reservation);

        assertEquals(ReservationStatus.CANCELLED, result.getStatus());
    }
}
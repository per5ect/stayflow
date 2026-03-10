package com.stayflow.backend.domain.reservation;

import com.stayflow.backend.common.exception.user.UnauthorizedException;
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
import java.util.List;
import java.util.Optional;

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
    private Reservation reservation;

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

        reservation = Reservation.builder()
                .id(1L)
                .renter(renter)
                .apartment(apartment)
                .checkIn(LocalDate.of(2025, 7, 1))
                .checkOut(LocalDate.of(2025, 7, 5))
                .status(ReservationStatus.PENDING)
                .totalPrice(BigDecimal.valueOf(400))
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
                .renter(renter)
                .checkIn(LocalDate.now())
                .status(ReservationStatus.APPROVED)
                .build();

        assertThrows(InvalidReservationException.class, () ->
                reservationService.cancelReservation(reservation, renter));
    }

    @Test
    void shouldCancelReservation_whenMoreThan24HoursBeforeCheckIn() {
        Reservation reservation = Reservation.builder()
                .id(1L)
                .renter(renter)
                .checkIn(LocalDate.now().plusDays(5))
                .status(ReservationStatus.APPROVED)
                .build();
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.cancelReservation(reservation, renter);

        assertEquals(ReservationStatus.CANCELLED, result.getStatus());
    }


    @Test
    void shouldReturnReservation_whenIdExists() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        Reservation result = reservationService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void shouldThrowException_whenReservationNotFound() {
        when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(InvalidReservationException.class, () ->
                reservationService.getById(99L));
    }

    @Test
    void shouldReturnRenterReservations() {
        when(reservationRepository.findByRenterId(1L)).thenReturn(List.of(reservation));

        List<Reservation> result = reservationService.getRenterReservations(1L);

        assertEquals(1, result.size());
        verify(reservationRepository).findByRenterId(1L);
    }

    @Test
    void shouldReturnLandlordReservations() {
        when(reservationRepository.findByApartmentLandlordId(1L)).thenReturn(List.of(reservation));

        List<Reservation> result = reservationService.getLandlordReservations(1L);

        assertEquals(1, result.size());
        verify(reservationRepository).findByApartmentLandlordId(1L);
    }

    @Test
    void shouldApproveReservation() {
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.approveReservation(reservation, landlord, "Welcome!");

        assertEquals(ReservationStatus.APPROVED, result.getStatus());
        assertEquals("Welcome!", result.getLandlordMessage());
        verify(reservationRepository).save(reservation);
    }

    @Test
    void shouldDeclineReservation() {
        when(reservationRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Reservation result = reservationService.declineReservation(reservation, landlord, "Sorry");

        assertEquals(ReservationStatus.DECLINED, result.getStatus());
        assertEquals("Sorry", result.getLandlordMessage());
        verify(reservationRepository).save(reservation);
    }

    @Test
    void shouldReturnAllReservations() {
        when(reservationRepository.findAll()).thenReturn(List.of(reservation));

        List<Reservation> result = reservationService.findAll();

        assertEquals(1, result.size());
        verify(reservationRepository).findAll();
    }

    @Test
    void shouldCountAllReservations() {
        when(reservationRepository.count()).thenReturn(4L);

        long result = reservationService.countAll();

        assertEquals(4L, result);
    }

    @Test
    void shouldCountReservationsByStatus() {
        when(reservationRepository.countByStatus(ReservationStatus.PENDING)).thenReturn(2L);

        long result = reservationService.countByStatus("PENDING");

        assertEquals(2L, result);
    }

    @Test
    void shouldThrowException_whenNonOwnerTriesToCancel() {
        User otherUser = User.builder()
                .id(99L)
                .email("other@test.com")
                .build();
        Reservation reservation = Reservation.builder()
                .id(1L)
                .renter(renter)
                .checkIn(LocalDate.now().plusDays(5))
                .status(ReservationStatus.APPROVED)
                .build();

        assertThrows(UnauthorizedException.class, () ->
                reservationService.cancelReservation(reservation, otherUser));
    }
}
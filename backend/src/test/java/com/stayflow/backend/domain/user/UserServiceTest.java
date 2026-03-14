package com.stayflow.backend.domain.user;

import com.stayflow.backend.common.exception.user.InvalidPasswordException;
import com.stayflow.backend.common.exception.user.InvalidVerificationCodeException;
import com.stayflow.backend.common.exception.user.UserAlreadyExistsException;
import com.stayflow.backend.common.exception.user.UserNotFoundException;
import com.stayflow.backend.domain.apartment.ApartmentRepository;
import com.stayflow.backend.domain.apartment.ApartmentStatus;
import com.stayflow.backend.domain.payment.PaymentRepository;
import com.stayflow.backend.domain.reservation.ReservationRepository;
import com.stayflow.backend.domain.reservation.ReservationStatus;
import com.stayflow.backend.web.user.dto.UserStatsResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private com.stayflow.backend.infrastructure.storage.CloudinaryService cloudinaryService;

    @Mock
    private ApartmentRepository apartmentRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private UserService userService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = User.builder()
                .id(1L)
                .firstName("Petr")
                .lastName("Svoboda")
                .email("petr@test.com")
                .password("hashedPassword")
                .role(UserRole.RENTER)
                .emailVerified(false)
                .enabled(false)
                .verificationCode("123456")
                .verificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
    }


    @Test
    void shouldRegisterUser_withEncodedPassword() {
        when(userRepository.existsByEmail("petr@test.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        User result = userService.register(
                "Petr", "Svoboda", "petr@test.com", "plainPassword", "+420123456789", UserRole.RENTER);

        assertNotNull(result);
        assertEquals("hashedPassword", result.getPassword());
        assertEquals(UserRole.RENTER, result.getRole());
        assertFalse(result.isEnabled());
        assertFalse(result.isEmailVerified());
        assertNotNull(result.getVerificationCode());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowUserAlreadyExistsException_whenEmailAlreadyRegistered() {
        when(userRepository.existsByEmail("petr@test.com")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () ->
                userService.register(
                        "Petr", "Svoboda", "petr@test.com",
                        "plainPassword", "+420123456789", UserRole.RENTER));
    }

    @Test
    void shouldVerifyEmail_whenCodeIsCorrectAndNotExpired() {
        when(userRepository.findByEmail("petr@test.com"))
                .thenReturn(Optional.of(existingUser));
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        User result = userService.verifyEmail("petr@test.com", "123456");

        assertTrue(result.isEmailVerified());
        assertTrue(result.isEnabled());
        assertNull(result.getVerificationCode());
    }

    @Test
    void shouldThrowException_whenVerificationCodeIsWrong() {
        when(userRepository.findByEmail("petr@test.com"))
                .thenReturn(Optional.of(existingUser));

        assertThrows(InvalidVerificationCodeException.class, () ->
                userService.verifyEmail("petr@test.com", "999999"));
    }

    @Test
    void shouldThrowException_whenVerificationCodeIsExpired() {
        existingUser.setVerificationCodeExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(userRepository.findByEmail("petr@test.com"))
                .thenReturn(Optional.of(existingUser));

        assertThrows(InvalidVerificationCodeException.class, () ->
                userService.verifyEmail("petr@test.com", "123456"));
    }


    @Test
    void shouldUpdateProfile_whenDataIsValid() {
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        User result = userService.updateProfile(existingUser, "Jan", "Novak", "new-photo-url");

        assertEquals("Jan", result.getFirstName());
        assertEquals("Novak", result.getLastName());
        assertEquals("new-photo-url", result.getPhotoUrl());
    }


    @Test
    void shouldChangePassword_whenOldPasswordIsCorrect() {
        when(passwordEncoder.matches("oldPassword", "hashedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newHashedPassword");
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        User result = userService.changePassword(existingUser, "oldPassword", "newPassword");

        assertEquals("newHashedPassword", result.getPassword());
    }

    @Test
    void shouldThrowException_whenOldPasswordIsWrong() {
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        assertThrows(InvalidPasswordException.class, () ->
                userService.changePassword(existingUser, "wrongPassword", "newPassword"));
    }

    @Test
    void shouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(
                User.builder().id(1L).email("user1@test.com").build(),
                User.builder().id(2L).email("user2@test.com").build()
        ));

        List<User> result = userService.findAll();

        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void shouldCountAllUsers() {
        // ARRANGE
        when(userRepository.count()).thenReturn(5L);

        long result = userService.countAll();

        assertEquals(5L, result);
    }

    @Test
    void shouldCountUsersByRole() {
        when(userRepository.countByRole(UserRole.RENTER)).thenReturn(3L);

        long result = userService.countByRole("RENTER");

        assertEquals(3L, result);
    }

    @Test
    void shouldDeleteOldAvatar_whenUpdatingAvatar() {
        existingUser.setPhotoUrl("old.png");
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        userService.updateAvatar(existingUser, "new.png");

        verify(cloudinaryService).deleteImage("old.png");
    }

    @Test
    void shouldDeleteUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.findByEmail(existingUser.getEmail())).thenReturn(Optional.of(existingUser));

        userService.deleteUser(1L);

        verify(userRepository).delete(existingUser);
    }

    @Test
    void shouldReturnLandlordStats() {
        Long landlordId = 10L;

        when(apartmentRepository.countByLandlordId(landlordId)).thenReturn(3L);
        when(apartmentRepository.countByLandlordIdAndStatus(landlordId, ApartmentStatus.ACTIVE))
                .thenReturn(2L);

        when(reservationRepository.countByApartmentLandlordId(landlordId)).thenReturn(5L);
        when(reservationRepository.countByApartmentLandlordIdAndStatus(landlordId, ReservationStatus.PENDING))
                .thenReturn(2L);
        when(reservationRepository.countByApartmentLandlordIdAndStatus(landlordId, ReservationStatus.APPROVED))
                .thenReturn(1L);
        when(reservationRepository.countByApartmentLandlordIdAndStatus(landlordId, ReservationStatus.DECLINED))
                .thenReturn(1L);
        when(reservationRepository.countByApartmentLandlordIdAndStatus(landlordId, ReservationStatus.PAID))
                .thenReturn(1L);

        when(paymentRepository.sumLandlordPayoutByLandlordId(landlordId))
                .thenReturn(new BigDecimal("900.0"));

        UserStatsResponse stats = userService.getLandlordStats(landlordId);

        assertEquals(3L, stats.getTotalApartments());
        assertEquals(2L, stats.getActiveApartments());
        assertEquals(5L, stats.getTotalReservations());
        assertEquals(2L, stats.getPendingReservations());
        assertEquals(1L, stats.getApprovedReservations());
        assertEquals(1L, stats.getDeclinedReservations());
        assertEquals(1L, stats.getPaidReservations());
        assertEquals(new BigDecimal("900.0"), stats.getTotalEarnings());
    }

    @Test
    void shouldReturnRenterStats() {
        Long renterId = 11L;

        when(reservationRepository.countByRenterId(renterId)).thenReturn(4L);
        when(reservationRepository.countByRenterIdAndStatus(renterId, ReservationStatus.PENDING))
                .thenReturn(1L);
        when(reservationRepository.countByRenterIdAndStatus(renterId, ReservationStatus.APPROVED))
                .thenReturn(1L);
        when(reservationRepository.countByRenterIdAndStatus(renterId, ReservationStatus.DECLINED))
                .thenReturn(1L);
        when(reservationRepository.countByRenterIdAndStatus(renterId, ReservationStatus.CANCELLED))
                .thenReturn(1L);
        when(reservationRepository.countByRenterIdAndStatus(renterId, ReservationStatus.PAID))
                .thenReturn(0L);

        when(paymentRepository.sumAmountByRenterId(renterId))
                .thenReturn(new BigDecimal("500.0"));

        UserStatsResponse stats = userService.getRenterStats(renterId);

        assertEquals(4L, stats.getTotalReservations());
        assertEquals(1L, stats.getPendingReservations());
        assertEquals(1L, stats.getApprovedReservations());
        assertEquals(1L, stats.getDeclinedReservations());
        assertEquals(1L, stats.getCancelledReservations());
        assertEquals(0L, stats.getPaidReservations());
        assertEquals(new BigDecimal("500.0"), stats.getTotalSpent());
    }
}

package com.stayflow.backend.domain.user;

import com.stayflow.backend.common.exception.user.InvalidPasswordException;
import com.stayflow.backend.common.exception.user.InvalidVerificationCodeException;
import com.stayflow.backend.common.exception.user.UserAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
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
                "Petr", "Svoboda", "petr@test.com", "plainPassword", UserRole.RENTER);

        assertNotNull(result);
        assertEquals("hashedPassword", result.getPassword());
        assertEquals(UserRole.RENTER, result.getRole());
        assertFalse(result.isEnabled());
        assertFalse(result.isEmailVerified());
        assertNotNull(result.getVerificationCode());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowException_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail("petr@test.com")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () ->
                userService.register(
                        "Petr", "Svoboda", "petr@test.com", "plainPassword", UserRole.RENTER));
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
}
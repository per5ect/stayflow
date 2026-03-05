package com.stayflow.backend.domain.user;

import com.stayflow.backend.common.exception.user.InvalidPasswordException;
import com.stayflow.backend.common.exception.user.InvalidVerificationCodeException;
import com.stayflow.backend.common.exception.user.UserAlreadyExistsException;
import com.stayflow.backend.common.exception.user.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(String firstName, String lastName,
                         String email, String password, UserRole role) {
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .emailVerified(false)
                .enabled(false)
                .verificationCode(generateVerificationCode())
                .verificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        return userRepository.save(user);
    }

    public User verifyEmail(String email, String code) {
        User user = findUserByEmail(email);
        validateVerificationCode(user, code);
        return activateUser(user);
    }

    public User updateProfile(User user, String firstName,
                              String lastName, String photoUrl) {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhotoUrl(photoUrl);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new InvalidPasswordException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private void validateVerificationCode(User user, String code) {
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code expired");
        }
        if (!user.getVerificationCode().equals(code)) {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }
    }

    private User activateUser(User user) {
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
package com.stayflow.backend.web.user;

import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserService;
import com.stayflow.backend.web.user.dto.ChangePasswordRequest;
import com.stayflow.backend.web.user.dto.UpdateProfileRequest;
import com.stayflow.backend.web.user.dto.UserProfileResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserProfileResponse.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateProfile(
                user,
                request.getFirstName(),
                request.getLastName(),
                request.getPhotoUrl()
        );
        return ResponseEntity.ok(UserProfileResponse.from(updated));
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully!");
    }
}
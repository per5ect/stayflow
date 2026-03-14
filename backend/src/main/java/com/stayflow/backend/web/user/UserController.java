package com.stayflow.backend.web.user;

import com.stayflow.backend.common.exception.user.UnauthorizedException;
import com.stayflow.backend.domain.user.User;
import com.stayflow.backend.domain.user.UserRole;
import com.stayflow.backend.domain.user.UserService;
import com.stayflow.backend.infrastructure.storage.CloudinaryService;
import com.stayflow.backend.web.user.dto.ChangePasswordRequest;
import com.stayflow.backend.web.user.dto.UpdateProfileRequest;
import com.stayflow.backend.web.user.dto.UserProfileResponse;
import com.stayflow.backend.web.user.dto.UserStatsResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;


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

    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsResponse> getMyStats(
            @AuthenticationPrincipal User user) {
        UserStatsResponse stats;
        if (user.getRole() == UserRole.LANDLORD) {
            stats = userService.getLandlordStats(user.getId());
        } else if (user.getRole() == UserRole.RENTER) {
            stats = userService.getRenterStats(user.getId());
        } else {
            throw new UnauthorizedException("Admins should use /api/admin/stats");
        }
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully!");
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadImage(file, "avatars");
        User updated = userService.updateAvatar(user, url);
        return ResponseEntity.ok(UserProfileResponse.from(updated));
    }
}

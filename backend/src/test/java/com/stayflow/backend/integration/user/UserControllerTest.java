package com.stayflow.backend.integration.user;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.infrastructure.storage.CloudinaryService;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import com.stayflow.backend.web.user.dto.ChangePasswordRequest;
import com.stayflow.backend.web.user.dto.UpdateProfileRequest;
import com.stayflow.backend.web.user.dto.UserProfileResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class UserControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    @MockitoBean
    CloudinaryService cloudinaryService;

    RestClient restClient;
    String renterToken;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());
        when(cloudinaryService.uploadImage(any(), anyString()))
                .thenReturn("https://cdn.test/avatar.png");
        renterToken = registerAndLogin("user@test.com", "RENTER");
    }

    @Test
    void getProfile_shouldReturnUserProfile() {
        var response = restClient.get()
                .uri("/api/users/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .retrieve()
                .toEntity(UserProfileResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getEmail()).isEqualTo("user@test.com");
    }

    @Test
    void updateProfile_shouldReturnUpdatedUser() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFirstName("New");
        request.setLastName("Name");
        request.setPhotoUrl("https://cdn.test/photo.png");

        var response = restClient.put()
                .uri("/api/users/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(UserProfileResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getFirstName()).isEqualTo("New");
        assertThat(response.getBody().getLastName()).isEqualTo("Name");
    }

    @Test
    void changePassword_shouldReturn200() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("password123");
        request.setNewPassword("newPassword123");

        var response = restClient.put()
                .uri("/api/users/me/password")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("Password changed successfully");
    }

    @Test
    void uploadAvatar_shouldReturnUpdatedUser() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "fake-image".getBytes());

        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);

        var response = restClient.post()
                .uri("/api/users/avatar")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toEntity(UserProfileResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getPhotoUrl()).isEqualTo("https://cdn.test/avatar.png");
    }

    private String registerAndLogin(String email, String role) {
        var reg = new RegisterRequest();
        reg.setFirstName("Test");
        reg.setLastName("User");
        reg.setEmail(email);
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole(role);
        restClient.post().uri("/api/auth/register").body(reg).retrieve().toBodilessEntity();

        var user = userRepository.findByEmail(email).orElseThrow();
        var verify = new VerifyEmailRequest();
        verify.setEmail(email);
        verify.setCode(user.getVerificationCode());
        restClient.post().uri("/api/auth/verify").body(verify).retrieve().toBodilessEntity();

        var login = new LoginRequest();
        login.setEmail(email);
        login.setPassword("password123");
        var response = restClient.post()
                .uri("/api/auth/login")
                .body(login)
                .retrieve()
                .toEntity(String.class);

        String body = response.getBody();
        return body.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }
}

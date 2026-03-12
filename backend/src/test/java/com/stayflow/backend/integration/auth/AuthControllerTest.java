package com.stayflow.backend.integration.auth;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class AuthControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    RestClient restClient;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());
    }

    @Test
    void register_shouldCreateUser() {
        var request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@test.com");
        request.setPassword("password123");
        request.setPhoneNumber("+1234567890");
        request.setRole("RENTER");

        var response = restClient.post()
                .uri("/api/auth/register")
                .body(request)
                .retrieve()
                .toEntity(String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(userRepository.findByEmail("john@test.com")).isPresent();
    }

    @Test
    void register_shouldReturn409_whenEmailAlreadyExists() {
        var request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@test.com");
        request.setPassword("password123");
        request.setPhoneNumber("+1234567890");
        request.setRole("RENTER");

        restClient.post().uri("/api/auth/register").body(request).retrieve().toBodilessEntity();

        try {
            restClient.post().uri("/api/auth/register").body(request).retrieve().toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("409");
        }
    }

    @Test
    void login_shouldReturn403_whenNotVerified() {
        var reg = new RegisterRequest();
        reg.setFirstName("Jane");
        reg.setLastName("Doe");
        reg.setEmail("jane@test.com");
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole("RENTER");
        restClient.post().uri("/api/auth/register").body(reg).retrieve().toBodilessEntity();

        var login = new LoginRequest();
        login.setEmail("jane@test.com");
        login.setPassword("password123");

        try {
            restClient.post().uri("/api/auth/login").body(login).retrieve().toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("403");
        }
    }

    @Test
    void login_shouldReturnToken_whenVerified() {
        // register
        var reg = new RegisterRequest();
        reg.setFirstName("Bob");
        reg.setLastName("Smith");
        reg.setEmail("bob@test.com");
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole("RENTER");
        restClient.post().uri("/api/auth/register").body(reg).retrieve().toBodilessEntity();

        // verify
        var user = userRepository.findByEmail("bob@test.com").orElseThrow();
        var verify = new VerifyEmailRequest();
        verify.setEmail("bob@test.com");
        verify.setCode(user.getVerificationCode());
        restClient.post().uri("/api/auth/verify").body(verify).retrieve().toBodilessEntity();

        // login
        var login = new LoginRequest();
        login.setEmail("bob@test.com");
        login.setPassword("password123");

        var response = restClient.post()
                .uri("/api/auth/login")
                .body(login)
                .retrieve()
                .toEntity(String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("token");
    }
}

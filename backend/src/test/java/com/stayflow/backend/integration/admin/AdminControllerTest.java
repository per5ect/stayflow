package com.stayflow.backend.integration.admin;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.admin.dto.AdminStatsResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class AdminControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    RestClient restClient;
    String adminToken;

    @Value("${ADMIN_EMAIL}")
    String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    String adminPassword;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());

        adminToken = loginAsAdmin();
    }

    @Test
    void stats_shouldReturnAdminStats() {
        var response = restClient.get()
                .uri("/api/admin/stats")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(AdminStatsResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getTotalUsers()).isNotNull();
        assertThat(response.getBody().getTotalPayments()).isNotNull();
    }

    @Test
    void getUsers_shouldReturnPage() {
        var response = restClient.get()
                .uri("/api/admin/users")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void getApartments_shouldReturnPage() {
        var response = restClient.get()
                .uri("/api/admin/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void getReservations_shouldReturnPage() {
        var response = restClient.get()
                .uri("/api/admin/reservations")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void getPayments_shouldReturnPage() {
        var response = restClient.get()
                .uri("/api/admin/payments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void deleteUser_shouldReturn200() {
        String renterToken = registerAndLoginRenter("delete-me@test.com");
        Long userId = userRepository.findByEmail("delete-me@test.com").orElseThrow().getId();

        var response = restClient.delete()
                .uri("/api/admin/users/" + userId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .toEntity(String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("User deleted successfully");
    }

    private String loginAsAdmin() {
        var login = new LoginRequest();
        login.setEmail(adminEmail);
        login.setPassword(adminPassword);
        var response = restClient.post()
                .uri("/api/auth/login")
                .body(login)
                .retrieve()
                .toEntity(String.class);

        String body = response.getBody();
        return body.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    private String registerAndLoginRenter(String email) {
        var reg = new RegisterRequest();
        reg.setFirstName("Test");
        reg.setLastName("User");
        reg.setEmail(email);
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole("RENTER");
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

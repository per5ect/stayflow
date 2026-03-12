package com.stayflow.backend.integration.admin;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.admin.dto.AdminStatsResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
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
}

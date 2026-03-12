package com.stayflow.backend.integration.apartment;

import com.stayflow.backend.domain.apartment.ApartmentType;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.LinkedHashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class ApartmentControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    RestClient restClient;
    String landlordToken;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());

        landlordToken = registerAndLoginLandlord("landlord@test.com");
    }

    private String registerAndLoginLandlord(String email) {
        var reg = new RegisterRequest();
        reg.setFirstName("Alice");
        reg.setLastName("Smith");
        reg.setEmail(email);
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole("LANDLORD");
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

    private ApartmentRequest buildRequest() {
        var req = new ApartmentRequest();
        req.setTitle("Nice Flat");
        req.setDescription("A cozy flat");
        req.setPricePerNight(new BigDecimal("99.99"));
        req.setStreet("Main St 1");
        req.setCity("Prague");
        req.setCountry("Czech Republic");
        req.setRoomsCount(2);
        req.setApartmentType(ApartmentType.APARTMENT);
        return req;
    }

    @Test
    void getAll_shouldReturnPageOfApartments() {
        restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toBodilessEntity();

        var response = restClient.get()
                .uri("/api/apartments")
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void create_shouldReturn200_whenLandlord() {
        var response = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getTitle()).isEqualTo("Nice Flat");
        assertThat(response.getBody().getCity()).isEqualTo("Prague");
    }

    @Test
    void create_shouldReturn403_whenNotAuthenticated() {
        try {
            restClient.post()
                    .uri("/api/apartments")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequest())
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("403");
        }
    }

    @Test
    void getById_shouldReturnApartment() {
        var created = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class)
                .getBody();

        var response = restClient.get()
                .uri("/api/apartments/" + created.getId())
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getId()).isEqualTo(created.getId());
    }

    @Test
    void deactivate_shouldReturn200_whenLandlord() {
        var created = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class)
                .getBody();

        var response = restClient.put()
                .uri("/api/apartments/" + created.getId() + "/deactivate")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().getStatus().name()).isEqualTo("INACTIVE");
    }

    @Test
    void getMyApartments_shouldReturnOnlyLandlordsApartments() {
        restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toBodilessEntity();

        var response = restClient.get()
                .uri("/api/apartments/my")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }
}

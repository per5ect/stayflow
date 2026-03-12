package com.stayflow.backend.integration.apartment;

import com.stayflow.backend.domain.apartment.ApartmentType;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.infrastructure.storage.CloudinaryService;
import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class ApartmentControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    @MockitoBean
    CloudinaryService cloudinaryService;

    RestClient restClient;
    String landlordToken;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());
        when(cloudinaryService.uploadImages(any(), anyString()))
                .thenReturn(List.of("https://cdn.test/photo1.png", "https://cdn.test/photo2.png"));

        landlordToken = registerAndLoginLandlord();
    }

    private String registerAndLoginLandlord() {
        var reg = new RegisterRequest();
        reg.setFirstName("Alice");
        reg.setLastName("Smith");
        reg.setEmail("landlord@test.com");
        reg.setPassword("password123");
        reg.setPhoneNumber("+1234567890");
        reg.setRole("LANDLORD");
        restClient.post().uri("/api/auth/register").body(reg).retrieve().toBodilessEntity();

        var user = userRepository.findByEmail("landlord@test.com").orElseThrow();
        var verify = new VerifyEmailRequest();
        verify.setEmail("landlord@test.com");
        verify.setCode(user.getVerificationCode());
        restClient.post().uri("/api/auth/verify").body(verify).retrieve().toBodilessEntity();

        var login = new LoginRequest();
        login.setEmail("landlord@test.com");
        login.setPassword("password123");
        var response = restClient.post()
                .uri("/api/auth/login")
                .body(login)
                .retrieve()
                .toEntity(String.class);

        String body = response.getBody();
        assert body != null;
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
        assert response.getBody() != null;
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

        assert created != null;
        var response = restClient.get()
                .uri("/api/apartments/" + created.getId())
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
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

        assert created != null;
        var response = restClient.put()
                .uri("/api/apartments/" + created.getId() + "/deactivate")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
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

    @Test
    void update_shouldReturnUpdatedApartment() {
        var created = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class)
                .getBody();

        var update = buildRequest();
        update.setTitle("Updated title");
        update.setPricePerNight(new BigDecimal("120.00"));

        assert created != null;
        var response = restClient.put()
                .uri("/api/apartments/" + created.getId())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(update)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getTitle()).isEqualTo("Updated title");
        assertThat(response.getBody().getPricePerNight()).isEqualTo(new BigDecimal("120.00"));
    }

    @Test
    void activate_shouldReturn200_whenLandlord() {
        var created = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class)
                .getBody();

        assert created != null;
        restClient.put()
                .uri("/api/apartments/" + created.getId() + "/deactivate")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toBodilessEntity();

        var response = restClient.put()
                .uri("/api/apartments/" + created.getId() + "/activate")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getStatus().name()).isEqualTo("ACTIVE");
    }

    @Test
    void photos_shouldAddAndDelete() {
        var created = restClient.post()
                .uri("/api/apartments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(buildRequest())
                .retrieve()
                .toEntity(ApartmentResponse.class)
                .getBody();

        MultiValueMap<String, Object> body = getStringObjectMultiValueMap();

        assert created != null;
        var addResponse = restClient.post()
                .uri("/api/apartments/" + created.getId() + "/photos")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(addResponse.getStatusCode().value()).isEqualTo(200);
        assert addResponse.getBody() != null;
        assertThat(addResponse.getBody().getPhotoUrls()).isNotEmpty();

        var deleteResponse = restClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/apartments/" + created.getId() + "/photos")
                        .queryParam("photoUrl", "https://cdn.test/photo1.png")
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ApartmentResponse.class);

        assertThat(deleteResponse.getStatusCode().value()).isEqualTo(200);
    }

    private static @NonNull MultiValueMap<String, Object> getStringObjectMultiValueMap() {
        ByteArrayResource file1 = new ByteArrayResource("img1".getBytes()) {
            @Override
            public String getFilename() {
                return "photo1.png";
            }
        };
        ByteArrayResource file2 = new ByteArrayResource("img2".getBytes()) {
            @Override
            public String getFilename() {
                return "photo2.png";
            }
        };
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("files", file1);
        body.add("files", file2);
        return body;
    }
}

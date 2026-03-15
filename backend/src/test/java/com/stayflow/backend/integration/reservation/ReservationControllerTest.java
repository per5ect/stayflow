package com.stayflow.backend.integration.reservation;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import com.stayflow.backend.web.reservation.dto.ReservationRequest;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class ReservationControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    RestClient restClient;
    String landlordToken;
    String renterToken;
    Long apartmentId;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());

        landlordToken = registerAndLogin("landlord@test.com", "LANDLORD");
        renterToken = registerAndLogin("renter@test.com", "RENTER");
        apartmentId = createApartment(landlordToken);
        addAvailability(landlordToken, apartmentId,
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(60));
    }

    @Test
    void create_shouldReturn200_whenRenter() {
        ReservationRequest request = new ReservationRequest();
        request.setApartmentId(apartmentId);
        request.setCheckIn(LocalDate.now().plusDays(5));
        request.setCheckOut(LocalDate.now().plusDays(8));

        var response = restClient.post()
                .uri("/api/reservations")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(ReservationResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getApartmentId()).isEqualTo(apartmentId);
        assertThat(response.getBody().getStatus().name()).isEqualTo("PENDING");
    }

    @Test
    void getMyReservations_shouldReturnPageForRenter() {
        createReservation();

        var response = restClient.get()
                .uri("/api/reservations/my")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void cancel_shouldReturn200_whenRenterCancelsOwnReservation() {
        Long reservationId = createReservation();

        var response = restClient.delete()
                .uri("/api/reservations/" + reservationId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .retrieve()
                .toEntity(String.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).contains("Reservation cancelled successfully");
    }

    @Test
    void approve_shouldReturn200_whenLandlordApproves() {
        Long reservationId = createReservation();

        var response = restClient.put()
                .uri("/api/reservations/" + reservationId + "/approve?message=Welcome")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ReservationResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getStatus().name()).isEqualTo("APPROVED");
    }

    @Test
    void decline_shouldReturn200_whenLandlordDeclines() {
        Long reservationId = createReservation();

        var response = restClient.put()
                .uri("/api/reservations/" + reservationId + "/decline?message=Sorry")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(ReservationResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getStatus().name()).isEqualTo("DECLINED");
    }

    @Test
    void getLandlordReservations_shouldReturnPageForLandlord() {
        createReservation();

        var response = restClient.get()
                .uri("/api/reservations/landlord")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKey("content");
    }

    @Test
    void getLandlordReservations_shouldReturn403_forRenter() {
        try {
            restClient.get()
                    .uri("/api/reservations/landlord")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("403");
        }
    }

    private Long createReservation() {
        ReservationRequest request = new ReservationRequest();
        request.setApartmentId(apartmentId);
        request.setCheckIn(LocalDate.now().plusDays(5));
        request.setCheckOut(LocalDate.now().plusDays(8));

        return Objects.requireNonNull(restClient.post()
                        .uri("/api/reservations")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(request)
                        .retrieve()
                        .toEntity(ReservationResponse.class)
                        .getBody())
                .getId();
    }

    private void addAvailability(String token, Long aptId, LocalDate from, LocalDate to) {
        restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/apartments/" + aptId + "/availability")
                        .queryParam("from", from.toString())
                        .queryParam("to", to.toString())
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .toBodilessEntity();
    }

    private Long createApartment(String token) {
        ApartmentRequest request = new ApartmentRequest();
        request.setTitle("Nice Flat");
        request.setDescription("A cozy flat");
        request.setPricePerNight(new BigDecimal("99.99"));
        request.setStreet("Main St 1");
        request.setCity("Prague");
        request.setCountry("Czech Republic");
        request.setRoomsCount(2);
        request.setApartmentType(com.stayflow.backend.domain.apartment.ApartmentType.APARTMENT);

        return Objects.requireNonNull(restClient.post()
                        .uri("/api/apartments")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(request)
                        .retrieve()
                        .toEntity(ApartmentResponse.class)
                        .getBody())
                .getId();
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
        assert body != null;
        return body.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }
}

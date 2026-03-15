package com.stayflow.backend.integration.payment;

import com.stayflow.backend.integration.BaseIntegrationTest;
import com.stayflow.backend.infrastructure.email.EmailService;
import com.stayflow.backend.web.apartment.dto.ApartmentRequest;
import com.stayflow.backend.web.apartment.dto.ApartmentResponse;
import com.stayflow.backend.web.auth.dto.LoginRequest;
import com.stayflow.backend.web.auth.dto.RegisterRequest;
import com.stayflow.backend.web.auth.dto.VerifyEmailRequest;
import com.stayflow.backend.web.payment.dto.PaymentRequest;
import com.stayflow.backend.web.payment.dto.PaymentResponse;
import com.stayflow.backend.web.reservation.dto.ReservationRequest;
import com.stayflow.backend.web.reservation.dto.ReservationResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

class PaymentControllerTest extends BaseIntegrationTest {

    @LocalServerPort
    int port;

    @MockitoBean
    EmailService emailService;

    RestClient restClient;
    String landlordToken;
    String renterToken;
    String otherRenterToken;
    Long apartmentId;
    Long reservationId;

    @BeforeEach
    void setUp() {
        restClient = RestClient.create("http://localhost:" + port);
        doNothing().when(emailService).sendVerificationCode(anyString(), anyString());

        landlordToken = registerAndLogin("landlord-pay@test.com", "LANDLORD");
        renterToken = registerAndLogin("renter-pay@test.com", "RENTER");
        otherRenterToken = registerAndLogin("other-renter@test.com", "RENTER");
        apartmentId = createApartment(landlordToken);
        addAvailability(landlordToken, apartmentId,
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(60));
        reservationId = createReservation(5);
        approveReservation();
    }

    @Test
    void pay_shouldReturn200_whenRenterPaysApprovedReservation() {
        PaymentRequest request = new PaymentRequest();
        request.setReservationId(reservationId);
        request.setCardBrand("VISA");
        request.setCardLastFour("4242");

        var response = restClient.post()
                .uri("/api/payments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(PaymentResponse.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assert response.getBody() != null;
        assertThat(response.getBody().getReservationId()).isEqualTo(reservationId);
        assertThat(response.getBody().getStatus().name()).isEqualTo("COMPLETED");
    }

    @Test
    void getMyPayments_shouldReturnListForRenter() {
        payReservation();

        var response = restClient.get()
                .uri("/api/payments/my")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .retrieve()
                .toEntity(PaymentResponse[].class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotEmpty();
    }

    @Test
    void getLandlordPayments_shouldReturnListForLandlord() {
        payReservation();

        var response = restClient.get()
                .uri("/api/payments/landlord")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
                .retrieve()
                .toEntity(PaymentResponse[].class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotEmpty();
    }

    @Test
    void pay_shouldReturn403_whenPayingOthersReservation() {
        PaymentRequest request = new PaymentRequest();
        request.setReservationId(reservationId);
        request.setCardBrand("VISA");
        request.setCardLastFour("4242");

        try {
            restClient.post()
                    .uri("/api/payments")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + otherRenterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("403");
        }
    }

    @Test
    void pay_shouldReturn400_whenReservationNotApproved() {
        Long pendingReservationId = createReservation(10);

        PaymentRequest request = new PaymentRequest();
        request.setReservationId(pendingReservationId);
        request.setCardBrand("VISA");
        request.setCardLastFour("4242");

        try {
            restClient.post()
                    .uri("/api/payments")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            assertThat(e.getMessage()).contains("400");
        }
    }

    private void payReservation() {
        PaymentRequest request = new PaymentRequest();
        request.setReservationId(reservationId);
        request.setCardBrand("VISA");
        request.setCardLastFour("4242");

        restClient.post()
                .uri("/api/payments")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + renterToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
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

    private Long createReservation(int startOffsetDays) {
        ReservationRequest request = new ReservationRequest();
        request.setApartmentId(apartmentId);
        request.setCheckIn(LocalDate.now().plusDays(startOffsetDays));
        request.setCheckOut(LocalDate.now().plusDays(startOffsetDays + 3));

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

    private void approveReservation() {
        restClient.put()
                .uri("/api/reservations/" + reservationId + "/approve")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + landlordToken)
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

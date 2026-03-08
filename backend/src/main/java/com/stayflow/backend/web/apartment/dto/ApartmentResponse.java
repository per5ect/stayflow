package com.stayflow.backend.web.apartment.dto;

import com.stayflow.backend.domain.apartment.Apartment;
import com.stayflow.backend.domain.apartment.ApartmentStatus;
import com.stayflow.backend.domain.apartment.ApartmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal pricePerNight;
    private String street;
    private String city;
    private String country;
    private Integer roomsCount;
    private ApartmentType apartmentType;
    private ApartmentStatus status;
    private String landlordName;
    private LocalDateTime createdAt;

    public static ApartmentResponse from(Apartment apartment) {
        return ApartmentResponse.builder()
                .id(apartment.getId())
                .title(apartment.getTitle())
                .description(apartment.getDescription())
                .pricePerNight(apartment.getPricePerNight())
                .street(apartment.getStreet())
                .city(apartment.getCity())
                .country(apartment.getCountry())
                .roomsCount(apartment.getRoomsCount())
                .apartmentType(apartment.getApartmentType())
                .status(apartment.getStatus())
                .landlordName(apartment.getLandlord().getFirstName()
                        + " " + apartment.getLandlord().getLastName())
                .createdAt(apartment.getCreatedAt())
                .build();
    }
}
package com.stayflow.backend.web.apartment.dto;

import com.stayflow.backend.domain.apartment.ApartmentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApartmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private java.math.BigDecimal pricePerNight;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    @NotNull(message = "Rooms count is required")
    @Min(value = 1, message = "Rooms count must be at least 1")
    private Integer roomsCount;

    @NotNull(message = "Apartment type is required")
    private ApartmentType apartmentType;
}
package com.stayflow.backend.web.apartment.dto;

import com.stayflow.backend.domain.apartment.ApartmentAvailableDates;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {

    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate availableFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate availableTo;

    public static AvailabilityResponse from(ApartmentAvailableDates w) {
        return new AvailabilityResponse(w.getId(), w.getAvailableFrom(), w.getAvailableTo());
    }
}

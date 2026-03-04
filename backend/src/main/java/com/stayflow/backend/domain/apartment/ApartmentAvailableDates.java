package com.stayflow.backend.domain.apartment;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "apartment_available_dates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentAvailableDates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(name = "available_from", nullable = false)
    private LocalDate availableFrom;

    @Column(name = "available_to", nullable = false)
    private LocalDate availableTo;
}
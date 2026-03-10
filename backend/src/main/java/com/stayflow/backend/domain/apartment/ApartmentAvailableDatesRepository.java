package com.stayflow.backend.domain.apartment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApartmentAvailableDatesRepository
        extends JpaRepository<ApartmentAvailableDates, Long> {

    List<ApartmentAvailableDates> findByApartmentId(Long apartmentId);

    @Query("SELECT COUNT(d) > 0 FROM ApartmentAvailableDates d " +
            "WHERE d.apartment.id = :apartmentId " +
            "AND d.availableFrom <= :checkIn " +
            "AND d.availableTo >= :checkOut")
    boolean existsAvailability(@Param("apartmentId") Long apartmentId,
                               @Param("checkIn") LocalDate checkIn,
                               @Param("checkOut") LocalDate checkOut);
}
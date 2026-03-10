package com.stayflow.backend.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT COUNT(r) > 0 FROM Reservation r
        WHERE r.apartment.id = :apartmentId
        AND r.status NOT IN ('CANCELLED', 'DECLINED')
        AND r.checkIn < :checkOut
        AND r.checkOut > :checkIn
    """)
    boolean existsOverlapping(
            @Param("apartmentId") Long apartmentId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    List<Reservation> findByRenterId(Long renterId);
    List<Reservation> findByApartmentLandlordId(Long landlordId);
    long countByStatus(ReservationStatus status);
}

package com.stayflow.backend.domain.reservation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT r FROM Reservation r WHERE r.renter.id = :renterId " +
            "AND (:status IS NULL OR CAST(r.status AS string) = :status)")
    Page<Reservation> findByRenterIdWithFilters(@Param("renterId") Long renterId,
                                                @Param("status") String status,
                                                Pageable pageable);

    @Query("SELECT r FROM Reservation r " +
            "JOIN r.apartment a " +
            "WHERE a.landlord.id = :landlordId " +
            "AND (:status IS NULL OR CAST(r.status AS string) = :status)")
    Page<Reservation> findByLandlordIdWithFilters(@Param("landlordId") Long landlordId,
                                                  @Param("status") String status,
                                                  Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE " +
            "(:status IS NULL OR CAST(r.status AS string) = :status)")
    Page<Reservation> findAllWithFilters(@Param("status") String status,
                                         Pageable pageable);
}

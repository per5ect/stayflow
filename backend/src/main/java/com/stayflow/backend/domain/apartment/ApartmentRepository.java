package com.stayflow.backend.domain.apartment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Apartment> findByStatus(ApartmentStatus status);

    long countByStatus(ApartmentStatus status);

    @Query("SELECT a FROM Apartment a WHERE a.status = com.stayflow.backend.domain.apartment.ApartmentStatus.ACTIVE " +
            "AND (:city IS NULL OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:minPrice IS NULL OR a.pricePerNight >= :minPrice) " +
            "AND (:maxPrice IS NULL OR a.pricePerNight <= :maxPrice) " +
            "AND (:minRooms IS NULL OR a.roomsCount >= :minRooms) " +
            "AND (:type IS NULL OR CAST(a.apartmentType AS string) = :type)")
    Page<Apartment> findWithFilters(@Param("city") String city,
                                    @Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice,
                                    @Param("minRooms") Integer minRooms,
                                    @Param("type") String type,
                                    Pageable pageable);

    @Query("SELECT a FROM Apartment a WHERE a.landlord.id = :landlordId " +
            "AND (:status IS NULL OR CAST(a.status AS string) = :status)")
    Page<Apartment> findByLandlordIdWithFilters(@Param("landlordId") Long landlordId,
                                                @Param("status") String status,
                                                Pageable pageable);

    @Query("SELECT a FROM Apartment a WHERE " +
            "(:status IS NULL OR CAST(a.status AS string) = :status) " +
            "AND (:city IS NULL OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%')))")
    Page<Apartment> findAllWithFilters(@Param("status") String status,
                                       @Param("city") String city,
                                       Pageable pageable);
}

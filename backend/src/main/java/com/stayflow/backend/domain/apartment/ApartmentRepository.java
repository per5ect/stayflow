package com.stayflow.backend.domain.apartment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Apartment> findByLandlordId(Long landlordId);
    List<Apartment> findByStatus(ApartmentStatus status);
    List<Apartment> findByCity(String city);
    List<Apartment> findByCityAndStatus(String city, ApartmentStatus status);
}

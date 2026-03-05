package com.stayflow.backend.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByReservationId(Long reservationId);
    List<Payment> findByLandlordId(Long landlordId);
    List<Payment> findByRenterId(Long renterId);
    List<Payment> findByStatus(PaymentStatus status);
}
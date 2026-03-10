package com.stayflow.backend.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByLandlordId(Long landlordId);
    List<Payment> findByRenterId(Long renterId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal sumAmount();

    @Query("SELECT COALESCE(SUM(p.commission), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal sumCommission();
}
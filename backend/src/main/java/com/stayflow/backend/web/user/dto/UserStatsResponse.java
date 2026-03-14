package com.stayflow.backend.web.user.dto;

import com.stayflow.backend.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private UserRole role;

    private Long totalApartments;
    private Long activeApartments;
    private BigDecimal totalEarnings;

    private Long totalReservations;
    private Long pendingReservations;
    private Long approvedReservations;
    private Long declinedReservations;
    private Long cancelledReservations;
    private Long paidReservations;

    private BigDecimal totalSpent;
}

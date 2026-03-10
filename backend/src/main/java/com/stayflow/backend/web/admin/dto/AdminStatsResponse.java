package com.stayflow.backend.web.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalLandlords;
    private long totalRenters;
    private long totalApartments;
    private long activeApartments;
    private long totalReservations;
    private long pendingReservations;
    private long approvedReservations;
    private long totalPayments;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommission;
}
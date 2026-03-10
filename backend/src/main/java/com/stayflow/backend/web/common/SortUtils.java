package com.stayflow.backend.web.common;

import org.springframework.data.domain.Sort;
import java.util.Map;

public class SortUtils {

    public static Sort buildSort(String sortBy, String sortDir,
                                 Map<String, String> allowedFields) {
        String sqlColumn = allowedFields.getOrDefault(sortBy, "created_at");
        return sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sqlColumn).ascending()
                : Sort.by(sqlColumn).descending();
    }

    public static final Map<String, String> APARTMENT_SORT_FIELDS = Map.of(
            "createdAt", "createdAt",
            "pricePerNight", "pricePerNight",
            "roomsCount", "roomsCount",
            "title", "title",
            "city", "city"
    );

    public static final Map<String, String> RESERVATION_SORT_FIELDS = Map.of(
            "createdAt", "createdAt",
            "checkIn", "checkIn",
            "checkOut", "checkOut",
            "totalPrice", "totalPrice",
            "status", "status"
    );

    public static final Map<String, String> USER_SORT_FIELDS = Map.of(
            "createdAt", "createdAt",
            "email", "email",
            "firstName", "firstName",
            "lastName", "lastName"
    );

    public static final Map<String, String> PAYMENT_SORT_FIELDS = Map.of(
            "paidAt", "paidAt",
            "amount", "amount",
            "status", "status",
            "createdAt", "createdAt"
    );
}
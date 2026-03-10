package com.stayflow.backend.common.exception.apartment;

public class ApartmentAvailabilityNotFoundException extends RuntimeException {
    public ApartmentAvailabilityNotFoundException(String message) {
        super(message);
    }
}
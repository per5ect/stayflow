package com.stayflow.backend.common.exception.apartment;

public class InvalidApartmentDataException extends RuntimeException {
    public InvalidApartmentDataException(String message) {
        super(message);
    }
}
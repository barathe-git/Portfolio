package com.bgv.portfolio.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * API response status values.
 * Used for consistent API response format.
 */
@Getter
@RequiredArgsConstructor
public enum ApiStatus {
    
    SUCCESS("success"),
    ERROR("error");

    private final String value;

    @Override
    public String toString() {
        return value;
    }
}

package com.bgv.portfolio.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * User roles for authorization.
 * Used for role-based access control throughout the application.
 */
@Getter
@RequiredArgsConstructor
public enum Role {
    
    ADMIN("ADMIN", "Full access - can manage users and all content"),
    EDITOR("EDITOR", "Can edit portfolio content"),
    VIEW("VIEW", "Read-only access to admin dashboard");

    private final String value;
    private final String description;

    /**
     * Check if this role has admin privileges.
     */
    public boolean isAdmin() {
        return this == ADMIN;
    }

    /**
     * Check if this role can edit content.
     */
    public boolean canEdit() {
        return this == ADMIN || this == EDITOR;
    }

    /**
     * Get Role from string value.
     *
     * @param value the role string
     * @return Role enum or null if not found
     */
    public static Role fromValue(String value) {
        if (value == null) return null;
        for (Role role : values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        return null;
    }

    /**
     * Check if a string is a valid role.
     *
     * @param value the role string to check
     * @return true if valid role
     */
    public static boolean isValid(String value) {
        return fromValue(value) != null;
    }

    @Override
    public String toString() {
        return value;
    }
}

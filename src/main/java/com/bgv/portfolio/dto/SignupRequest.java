package com.bgv.portfolio.dto;

import com.bgv.portfolio.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.bgv.portfolio.constants.AppConstants.*;

/**
 * DTO for user signup/creation request.
 * Used by admin to create new users with specific roles.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Username is required")
    @Size(min = USERNAME_MIN_LENGTH, max = USERNAME_MAX_LENGTH, 
          message = "Username must be between " + USERNAME_MIN_LENGTH + " and " + USERNAME_MAX_LENGTH + " characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH, 
          message = "Password must be between " + PASSWORD_MIN_LENGTH + " and " + PASSWORD_MAX_LENGTH + " characters")
    private String password;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = PHONE_REGEX, message = "Invalid phone number format")
    private String phoneNumber;

    @NotNull(message = "Role is required")
    private Role role;
}

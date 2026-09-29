package com.bgv.portfolio.model;

import com.bgv.portfolio.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private Role role;
}

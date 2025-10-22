package com.bgv.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String location;
    private String phone;
    private String summary;
    private String title;
    private String github;
    private String linkedin;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educationList;
}

package com.bgv.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationDTO {
    private Long id;

    @NotBlank(message = "Institute name is required")
    private String institute;

    @NotBlank(message = "Degree is required")
    private String degree;

    private Double cgpa;
    private String percentage;
    private String board;

    @NotBlank(message = "Duration is required")
    private String duration;
}

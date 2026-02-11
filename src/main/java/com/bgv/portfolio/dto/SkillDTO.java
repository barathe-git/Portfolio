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
public class SkillDTO {
    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotBlank(message = "Skill level is required")
    private String level;

    @NotBlank(message = "Skill category is required")
    private String category;
}

package com.bgv.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    
    @NotBlank(message = "Project name is required")
    private String name;
    
    @NotBlank(message = "Project description is required")
    private String description;
    
    private String githubUrl;
    private String techStack;
    private List<String> highlight;
    private String liveDemoUrl;
}

package com.bgv.portfolio.dto;

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
    private String institute;
    private String degree;
    private Double cgpa;
    private String percentage;
    private String board;
    private String duration;
}

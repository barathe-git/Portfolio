package com.bgv.portfolio.storage;

import com.bgv.portfolio.dto.EducationDTO;
import com.bgv.portfolio.dto.ProfileDTO;
import com.bgv.portfolio.dto.ProjectDTO;
import com.bgv.portfolio.dto.SkillDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/** Canonical on-disk representation of the portfolio. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDocument {
    private int version;
    private ProfileDTO profile;
    private List<SkillDTO> skills = new ArrayList<>();
    private List<ProjectDTO> projects = new ArrayList<>();
    private List<ExperienceRecord> experiences = new ArrayList<>();
    private List<EducationDTO> education = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceRecord {
        private Long id;
        private String company;
        private String role;
        private String duration;
        private String description;
        private List<Long> projectIds = new ArrayList<>();
    }
}

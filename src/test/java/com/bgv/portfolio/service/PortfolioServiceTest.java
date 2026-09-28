package com.bgv.portfolio.service;

import com.bgv.portfolio.dto.ExperienceDTO;
import com.bgv.portfolio.dto.EducationDTO;
import com.bgv.portfolio.dto.ProfileDTO;
import com.bgv.portfolio.dto.ProjectDTO;
import com.bgv.portfolio.dto.SkillDTO;
import com.bgv.portfolio.exception.ResourceNotFoundException;
import com.bgv.portfolio.storage.JsonPortfolioStore;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PortfolioServiceTest {

    @TempDir
    Path directory;

    private PortfolioService service;

    @BeforeEach
    void setUp() {
        JsonPortfolioStore store = new JsonPortfolioStore(new ObjectMapper(), directory.resolve("portfolio.json").toString());
        store.initialize();
        service = new PortfolioService(store);
    }

    @Test
    void generatesStableIdsAndPersistsCrud() {
        ProjectDTO created = service.addProject(ProjectDTO.builder()
                .name("New project")
                .description("Created in test")
                .build());

        assertThat(created.getId()).isEqualTo(7L);
        assertThat(service.getProjectById(7L).getName()).isEqualTo("New project");

        created.setName("Updated project");
        assertThat(service.updateProject(7L, created).getName()).isEqualTo("Updated project");
    }

    @Test
    void supportsProfileSkillEducationAndExperienceCrud() {
        ProfileDTO profile = service.getProfile();
        profile.setTitle("Principal Engineer");
        assertThat(service.updateProfile(1L, profile).getTitle()).isEqualTo("Principal Engineer");

        SkillDTO skill = service.addSkill(SkillDTO.builder().name("Test skill").category("Tests").build());
        assertThat(skill.getId()).isEqualTo(42L);
        skill.setName("Updated skill");
        assertThat(service.updateSkill(skill.getId(), skill).getName()).isEqualTo("Updated skill");
        service.deleteSkill(skill.getId());
        assertThatThrownBy(() -> service.getSkillById(skill.getId())).isInstanceOf(ResourceNotFoundException.class);

        EducationDTO education = service.addEducation(EducationDTO.builder()
                .institute("Test Institute").degree("Test Degree").duration("2020 - 2021").build());
        assertThat(education.getId()).isEqualTo(4L);
        education.setDegree("Updated Degree");
        assertThat(service.updateEducation(education.getId(), education).getDegree()).isEqualTo("Updated Degree");
        service.deleteEducation(education.getId());
        assertThatThrownBy(() -> service.getEducationById(education.getId())).isInstanceOf(ResourceNotFoundException.class);

        ExperienceDTO experience = service.addExperience(ExperienceDTO.builder()
                .company("Test Company").role("Engineer").duration("2024").projects(Set.of()).build());
        experience.setRole("Senior Engineer");
        assertThat(service.updateExperience(experience.getId(), experience).getRole()).isEqualTo("Senior Engineer");
        service.deleteExperience(experience.getId());
        assertThatThrownBy(() -> service.getExperienceById(experience.getId())).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void reconstructsExperienceProjectsAndCleansLinksOnProjectDelete() {
        ExperienceDTO created = service.addExperience(ExperienceDTO.builder()
                .company("Example Co")
                .role("Engineer")
                .duration("2025 - Present")
                .projects(Set.of(ProjectDTO.builder().id(1L).build()))
                .build());

        assertThat(created.getId()).isEqualTo(5L);
        assertThat(created.getProjects()).extracting(ProjectDTO::getId).containsExactly(1L);

        service.deleteProject(1L);

        assertThat(service.getExperienceById(created.getId()).getProjects()).isEmpty();
        assertThat(service.getExperienceById(3L).getProjects()).isEmpty();
    }

    @Test
    void rejectsUnknownProjectAssociations() {
        ExperienceDTO experience = ExperienceDTO.builder()
                .company("Example Co")
                .role("Engineer")
                .duration("2025")
                .projects(Set.of(ProjectDTO.builder().id(999L).build()))
                .build();

        assertThatThrownBy(() -> service.addExperience(experience))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("999");
    }
}

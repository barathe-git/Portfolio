package com.bgv.portfolio.service;

import com.bgv.portfolio.dto.*;
import com.bgv.portfolio.exception.ResourceNotFoundException;
import com.bgv.portfolio.model.*;
import com.bgv.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PortfolioService {

    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;

    // ---------------- Public ----------------

    @Transactional(readOnly = true)
    public ProfileDTO getProfile() {
        log.debug("Fetching profile from database");
        Profile profile = profileRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return mapToDTO(profile);
    }

    @Transactional(readOnly = true)
    public List<SkillDTO> getSkills() {
        log.debug("Fetching all skills from database");
        return skillRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjects() {
        log.debug("Fetching all projects from database");
        return projectRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExperienceDTO> getExperiences() {
        log.debug("Fetching all experiences from database");
        return experienceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EducationDTO> getEducation() {
        log.debug("Fetching all education records from database");
        return educationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ---------------- Admin ----------------

    public ProjectDTO addProject(ProjectDTO dto) {
        log.info("Creating new project: {}", dto.getName());
        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .githubUrl(dto.getGithubUrl())
                .techStack(dto.getTechStack())
                .highlight(dto.getHighlight())
                .liveDemoUrl(dto.getLiveDemoUrl())
                .build();
        Project saved = projectRepository.save(project);
        log.info("Project created successfully with id: {}", saved.getId());
        return mapToDTO(saved);
    }

    public ProfileDTO updateProfile(Long id, ProfileDTO dto) {
        log.info("Updating profile with id: {}", id);
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        profile.setName(dto.getName());
        profile.setTitle(dto.getTitle());
        profile.setSummary(dto.getSummary());
        profile.setLocation(dto.getLocation());
        profile.setEmail(dto.getEmail());
        profile.setLinkedin(dto.getLinkedin());
        profile.setGithub(dto.getGithub());
        profile.setPhone(dto.getPhone());
        profileRepository.save(profile);
        log.info("Profile updated successfully");
        return mapToDTO(profile);
    }

    public void deleteSkill(Long id) {
        log.info("Deleting skill with id: {}", id);
        if(!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
        log.info("Skill deleted successfully");
    }

    // ---------------- Mapping Helpers ----------------

    private ProfileDTO mapToDTO(Profile profile) {
        return ProfileDTO.builder()
                .id(profile.getId())
                .name(profile.getName())
                .title(profile.getTitle())
                .summary(profile.getSummary())
                .location(profile.getLocation())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .linkedin(profile.getLinkedin())
                .github(profile.getGithub())
                .experiences(profile.getExperiences().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .educationList(profile.getEducationList().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .build();
    }

    private SkillDTO mapToDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .level(skill.getLevel())
                .category(skill.getCategory())
                .build();
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .githubUrl(project.getGithubUrl())
                .techStack(project.getTechStack())
                .highlight(project.getHighlight())
                .liveDemoUrl(project.getLiveDemoUrl())
                .build();
    }

    private ExperienceDTO mapToDTO(Experience exp) {
        return ExperienceDTO.builder()
                .id(exp.getId())
                .company(exp.getCompany())
                .role(exp.getRole())
                .duration(exp.getDuration())
                .description(exp.getDescription())
                .projects(exp.getProjects().stream().map(this::mapToDTO).collect(Collectors.toSet()))
                .build();
    }

    private EducationDTO mapToDTO(Education edu) {
        return EducationDTO.builder()
                .id(edu.getId())
                .institute(edu.getInstitute())
                .degree(edu.getDegree())
                .cgpa(edu.getCgpa())
                .percentage(edu.getPercentage())
                .board(edu.getBoard())
                .duration(edu.getDuration())
                .build();
    }
}

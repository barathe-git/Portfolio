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
    public ProfileDTO getProfileById(Long id) {
        log.debug("Fetching profile with id: {}" , id);
        Profile profile = profileRepository.findByIdWithEagerLoading(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
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
        return experienceRepository.findAllWithEagerProjects().stream()
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

    @SuppressWarnings("null")
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
        log.info("Project created successfully with id: {}", saved != null ? saved.getId() : null);
        return saved != null ? mapToDTO(saved) : null;
    }

    public ProfileDTO updateProfile(Long id, ProfileDTO dto) {
        log.info("Updating profile with id: {}", id);
        if (id == null) {
            throw new IllegalArgumentException("Profile id cannot be null");
        }
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
        if (id == null || !skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
        log.info("Skill deleted successfully");
    }

    // -------- Additional CRUD Operations --------

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        log.debug("Fetching project with id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToDTO(project);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        log.info("Updating project with id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setGithubUrl(dto.getGithubUrl());
        project.setTechStack(dto.getTechStack());
        project.setHighlight(dto.getHighlight());
        project.setLiveDemoUrl(dto.getLiveDemoUrl());
        projectRepository.save(project);
        log.info("Project updated successfully");
        return mapToDTO(project);
    }

    public void deleteProject(Long id) {
        log.info("Deleting project with id: {}", id);
        if (id == null || !projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
        log.info("Project deleted successfully");
    }

    @Transactional(readOnly = true)
    public ExperienceDTO getExperienceById(Long id) {
        log.debug("Fetching experience with id: {}", id);
        Experience experience = experienceRepository.findByIdWithEagerProjects(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        return mapToDTO(experience);
    }

    public ExperienceDTO addExperience(ExperienceDTO dto) {
        log.info("Creating new experience: {}", dto.getCompany());
        Experience experience = Experience.builder()
                .company(dto.getCompany())
                .role(dto.getRole())
                .duration(dto.getDuration())
                .description(dto.getDescription())
                .build();
        Experience saved = experienceRepository.save(experience);
        log.info("Experience created successfully with id: {}", saved.getId());
        return mapToDTO(saved);
    }

    public ExperienceDTO updateExperience(Long id, ExperienceDTO dto) {
        log.info("Updating experience with id: {}", id);
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        experience.setCompany(dto.getCompany());
        experience.setRole(dto.getRole());
        experience.setDuration(dto.getDuration());
        experience.setDescription(dto.getDescription());
        experienceRepository.save(experience);
        log.info("Experience updated successfully");
        return mapToDTO(experience);
    }

    public void deleteExperience(Long id) {
        log.info("Deleting experience with id: {}", id);
        if (id == null || !experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience not found with id: " + id);
        }
        experienceRepository.deleteById(id);
        log.info("Experience deleted successfully");
    }

    @Transactional(readOnly = true)
    public EducationDTO getEducationById(Long id) {
        log.debug("Fetching education with id: {}", id);
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));
        return mapToDTO(education);
    }

    public EducationDTO addEducation(EducationDTO dto) {
        log.info("Creating new education record: {}", dto.getInstitute());
        Education education = Education.builder()
                .institute(dto.getInstitute())
                .degree(dto.getDegree())
                .cgpa(dto.getCgpa())
                .percentage(dto.getPercentage())
                .board(dto.getBoard())
                .duration(dto.getDuration())
                .build();
        Education saved = educationRepository.save(education);
        log.info("Education record created successfully with id: {}", saved.getId());
        return mapToDTO(saved);
    }

    public EducationDTO updateEducation(Long id, EducationDTO dto) {
        log.info("Updating education with id: {}", id);
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));
        education.setInstitute(dto.getInstitute());
        education.setDegree(dto.getDegree());
        education.setCgpa(dto.getCgpa());
        education.setPercentage(dto.getPercentage());
        education.setBoard(dto.getBoard());
        education.setDuration(dto.getDuration());
        educationRepository.save(education);
        log.info("Education updated successfully");
        return mapToDTO(education);
    }

    public void deleteEducation(Long id) {
        log.info("Deleting education with id: {}", id);
        if (id == null || !educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Education not found with id: " + id);
        }
        educationRepository.deleteById(id);
        log.info("Education deleted successfully");
    }

    @Transactional(readOnly = true)
    public SkillDTO getSkillById(Long id) {
        log.debug("Fetching skill with id: {}", id);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        return mapToDTO(skill);
    }

    public SkillDTO addSkill(SkillDTO dto) {
        log.info("Creating new skill: {}", dto.getName());
        Skill skill = Skill.builder()
                .name(dto.getName())
                .level(dto.getLevel())
                .category(dto.getCategory())
                .build();
        Skill saved = skillRepository.save(skill);
        log.info("Skill created successfully with id: {}", saved.getId());
        return mapToDTO(saved);
    }

    public SkillDTO updateSkill(Long id, SkillDTO dto) {
        log.info("Updating skill with id: {}", id);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skill.setName(dto.getName());
        skill.setLevel(dto.getLevel());
        skill.setCategory(dto.getCategory());
        skillRepository.save(skill);
        log.info("Skill updated successfully");
        return mapToDTO(skill);
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

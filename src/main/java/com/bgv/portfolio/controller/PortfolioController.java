package com.bgv.portfolio.controller;

import com.bgv.portfolio.dto.*;
import com.bgv.portfolio.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Portfolio API", description = "APIs for managing portfolio data")
public class PortfolioController {

    private final PortfolioService service;

    // ---------------- Public Endpoints ----------------
    @Operation(summary = "Get profile information")
    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getProfile() {
        log.debug("Fetching profile information");
        return ResponseEntity.ok(service.getProfile());
    }

    @Operation(summary = "Get all skills")
    @GetMapping("/skills")
    public ResponseEntity<List<SkillDTO>> getSkills() {
        log.debug("Fetching all skills");
        return ResponseEntity.ok(service.getSkills());
    }

    @Operation(summary = "Get all projects")
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getProjects() {
        log.debug("Fetching all projects");
        return ResponseEntity.ok(service.getProjects());
    }

    @Operation(summary = "Get all experiences")
    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDTO>> getExperiences() {
        log.debug("Fetching all experiences");
        return ResponseEntity.ok(service.getExperiences());
    }

    @Operation(summary = "Get all education")
    @GetMapping("/education")
    public ResponseEntity<List<EducationDTO>> getEducation() {
        log.debug("Fetching all education");
        return ResponseEntity.ok(service.getEducation());
    }

    // ---------------- Admin Endpoints (JWT Secured) ----------------
    @Operation(summary = "Add a new project (Admin only)")
    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> addProject(@Valid @RequestBody ProjectDTO dto) {
        log.info("Adding new project: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addProject(dto));
    }

    @Operation(summary = "Update profile (Admin only)")
    @PutMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> updateProfile(@PathVariable Long id, @Valid @RequestBody ProfileDTO dto) {
        log.info("Updating profile with id: {}", id);
        return ResponseEntity.ok(service.updateProfile(id, dto));
    }

    @Operation(summary = "Delete a skill (Admin only)")
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        log.info("Deleting skill with id: {}", id);
        service.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    // -------- Additional Admin Endpoints --------

    @Operation(summary = "Get a project by ID (Admin only)")
    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        log.debug("Fetching project with id: {}", id);
        return ResponseEntity.ok(service.getProjectById(id));
    }

    @Operation(summary = "Update a project (Admin only)")
    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        log.info("Updating project with id: {}", id);
        return ResponseEntity.ok(service.updateProject(id, dto));
    }

    @Operation(summary = "Delete a project (Admin only)")
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.info("Deleting project with id: {}", id);
        service.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get an experience by ID (Admin only)")
    @GetMapping("/experience/{id}")
    public ResponseEntity<ExperienceDTO> getExperienceById(@PathVariable Long id) {
        log.debug("Fetching experience with id: {}", id);
        return ResponseEntity.ok(service.getExperienceById(id));
    }

    @Operation(summary = "Add a new experience (Admin only)")
    @PostMapping("/experience")
    public ResponseEntity<ExperienceDTO> addExperience(@Valid @RequestBody ExperienceDTO dto) {
        log.info("Adding new experience: {}", dto.getCompany());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addExperience(dto));
    }

    @Operation(summary = "Update an experience (Admin only)")
    @PutMapping("/experience/{id}")
    public ResponseEntity<ExperienceDTO> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDTO dto) {
        log.info("Updating experience with id: {}", id);
        return ResponseEntity.ok(service.updateExperience(id, dto));
    }

    @Operation(summary = "Delete an experience (Admin only)")
    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        log.info("Deleting experience with id: {}", id);
        service.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get an education record by ID (Admin only)")
    @GetMapping("/education/{id}")
    public ResponseEntity<EducationDTO> getEducationById(@PathVariable Long id) {
        log.debug("Fetching education with id: {}", id);
        return ResponseEntity.ok(service.getEducationById(id));
    }

    @Operation(summary = "Add a new education record (Admin only)")
    @PostMapping("/education")
    public ResponseEntity<EducationDTO> addEducation(@Valid @RequestBody EducationDTO dto) {
        log.info("Adding new education record: {}", dto.getInstitute());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addEducation(dto));
    }

    @Operation(summary = "Update an education record (Admin only)")
    @PutMapping("/education/{id}")
    public ResponseEntity<EducationDTO> updateEducation(@PathVariable Long id, @Valid @RequestBody EducationDTO dto) {
        log.info("Updating education with id: {}", id);
        return ResponseEntity.ok(service.updateEducation(id, dto));
    }

    @Operation(summary = "Delete an education record (Admin only)")
    @DeleteMapping("/education/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        log.info("Deleting education with id: {}", id);
        service.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a skill by ID (Admin only)")
    @GetMapping("/skills/{id}")
    public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
        log.debug("Fetching skill with id: {}", id);
        return ResponseEntity.ok(service.getSkillById(id));
    }

    @Operation(summary = "Add a new skill (Admin only)")
    @PostMapping("/skills")
    public ResponseEntity<SkillDTO> addSkill(@Valid @RequestBody SkillDTO dto) {
        log.info("Adding new skill: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addSkill(dto));
    }

    @Operation(summary = "Update a skill (Admin only)")
    @PutMapping("/skills/{id}")
    public ResponseEntity<SkillDTO> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDTO dto) {
        log.info("Updating skill with id: {}", id);
        return ResponseEntity.ok(service.updateSkill(id, dto));
    }
}

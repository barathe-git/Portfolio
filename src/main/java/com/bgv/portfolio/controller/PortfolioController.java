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
    public ResponseEntity<ApiResponse<ProfileDTO>> getProfile() {
        log.debug("Fetching profile information");
        return ResponseEntity.ok(ApiResponse.success(service.getProfile()));
    }

    @Operation(summary = "Get all skills")
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillDTO>>> getSkills() {
        log.debug("Fetching all skills");
        return ResponseEntity.ok(ApiResponse.success(service.getSkills()));
    }

    @Operation(summary = "Get all projects")
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getProjects() {
        log.debug("Fetching all projects");
        return ResponseEntity.ok(ApiResponse.success(service.getProjects()));
    }

    @Operation(summary = "Get all experiences")
    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<ExperienceDTO>>> getExperiences() {
        log.debug("Fetching all experiences");
        return ResponseEntity.ok(ApiResponse.success(service.getExperiences()));
    }

    @Operation(summary = "Get all education")
    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<EducationDTO>>> getEducation() {
        log.debug("Fetching all education");
        return ResponseEntity.ok(ApiResponse.success(service.getEducation()));
    }

    // ---------------- Admin Endpoints (JWT Secured) ----------------
    @Operation(summary = "Add a new project (Admin only)")
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectDTO>> addProject(@Valid @RequestBody ProjectDTO dto) {
        log.info("Adding new project: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(service.addProject(dto), "Project created successfully"));
    }

    @Operation(summary = "Update profile (Admin only)")
    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<ProfileDTO>> updateProfile(@PathVariable Long id, @Valid @RequestBody ProfileDTO dto) {
        log.info("Updating profile with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.updateProfile(id, dto), "Profile updated successfully"));
    }

    @Operation(summary = "Delete a skill (Admin only)")
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        log.info("Deleting skill with id: {}", id);
        service.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully"));
    }

    // -------- Additional Admin Endpoints --------

    @Operation(summary = "Get a project by ID (Admin only)")
    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable Long id) {
        log.debug("Fetching project with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.getProjectById(id)));
    }

    @Operation(summary = "Update a project (Admin only)")
    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        log.info("Updating project with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.updateProject(id, dto), "Project updated successfully"));
    }

    @Operation(summary = "Delete a project (Admin only)")
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        log.info("Deleting project with id: {}", id);
        service.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }

    @Operation(summary = "Get an experience by ID (Admin only)")
    @GetMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<ExperienceDTO>> getExperienceById(@PathVariable Long id) {
        log.debug("Fetching experience with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.getExperienceById(id)));
    }

    @Operation(summary = "Add a new experience (Admin only)")
    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<ExperienceDTO>> addExperience(@Valid @RequestBody ExperienceDTO dto) {
        log.info("Adding new experience: {}", dto.getCompany());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(service.addExperience(dto), "Experience created successfully"));
    }

    @Operation(summary = "Update an experience (Admin only)")
    @PutMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<ExperienceDTO>> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDTO dto) {
        log.info("Updating experience with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.updateExperience(id, dto), "Experience updated successfully"));
    }

    @Operation(summary = "Delete an experience (Admin only)")
    @DeleteMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        log.info("Deleting experience with id: {}", id);
        service.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.success("Experience deleted successfully"));
    }

    @Operation(summary = "Get an education record by ID (Admin only)")
    @GetMapping("/education/{id}")
    public ResponseEntity<ApiResponse<EducationDTO>> getEducationById(@PathVariable Long id) {
        log.debug("Fetching education with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.getEducationById(id)));
    }

    @Operation(summary = "Add a new education record (Admin only)")
    @PostMapping("/education")
    public ResponseEntity<ApiResponse<EducationDTO>> addEducation(@Valid @RequestBody EducationDTO dto) {
        log.info("Adding new education record: {}", dto.getInstitute());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(service.addEducation(dto), "Education record created successfully"));
    }

    @Operation(summary = "Update an education record (Admin only)")
    @PutMapping("/education/{id}")
    public ResponseEntity<ApiResponse<EducationDTO>> updateEducation(@PathVariable Long id, @Valid @RequestBody EducationDTO dto) {
        log.info("Updating education with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.updateEducation(id, dto), "Education record updated successfully"));
    }

    @Operation(summary = "Delete an education record (Admin only)")
    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long id) {
        log.info("Deleting education with id: {}", id);
        service.deleteEducation(id);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted successfully"));
    }

    @Operation(summary = "Get a skill by ID (Admin only)")
    @GetMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<SkillDTO>> getSkillById(@PathVariable Long id) {
        log.debug("Fetching skill with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.getSkillById(id)));
    }

    @Operation(summary = "Add a new skill (Admin only)")
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<SkillDTO>> addSkill(@Valid @RequestBody SkillDTO dto) {
        log.info("Adding new skill: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(service.addSkill(dto), "Skill created successfully"));
    }

    @Operation(summary = "Update a skill (Admin only)")
    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<SkillDTO>> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDTO dto) {
        log.info("Updating skill with id: {}", id);
        return ResponseEntity.ok(ApiResponse.success(service.updateSkill(id, dto), "Skill updated successfully"));
    }
}

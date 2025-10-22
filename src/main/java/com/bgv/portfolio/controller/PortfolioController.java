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
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> addProject(@Valid @RequestBody ProjectDTO dto) {
        log.info("Adding new project: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addProject(dto));
    }

    @Operation(summary = "Update profile (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> updateProfile(@PathVariable Long id, @Valid @RequestBody ProfileDTO dto) {
        log.info("Updating profile with id: {}", id);
        return ResponseEntity.ok(service.updateProfile(id, dto));
    }

    @Operation(summary = "Delete a skill (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        log.info("Deleting skill with id: {}", id);
        service.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}

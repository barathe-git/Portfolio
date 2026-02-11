package com.bgv.portfolio.controller;

import com.bgv.portfolio.bootstrap.ResumeDataService;
import com.bgv.portfolio.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ResumeDataService resumeDataService;

    public AdminController(ResumeDataService resumeDataService) {
        this.resumeDataService = resumeDataService;
    }

    @PostMapping("/reload-resume")
    public ResponseEntity<ApiResponse<Void>> reloadResume() {
        try {
            resumeDataService.forceImportFromClasspath();
            return ResponseEntity.ok(ApiResponse.success("Resume data reloaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to reload resume: " + e.getMessage(), "/api/admin/reload-resume"));
        }
    }
}

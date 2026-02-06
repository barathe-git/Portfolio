package com.bgv.portfolio.bootstrap;

import com.bgv.portfolio.model.*;
import com.bgv.portfolio.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeDataService {

    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final ObjectMapper objectMapper;

    public void importIfEmpty() throws Exception {
        if (profileRepository.count() == 0) {
            importFromClasspath();
        }
    }

    @Transactional
    public void forceImportFromClasspath() throws Exception {
        clearAll();
        importFromClasspath();
    }

    @Transactional
    protected void clearAll() {
        experienceRepository.deleteAll();
        projectRepository.deleteAll();
        educationRepository.deleteAll();
        skillRepository.deleteAll();
        profileRepository.deleteAll();
    }

    private void importFromClasspath() throws Exception {
        InputStream is = new ClassPathResource("resume.json").getInputStream();
        JsonNode root = objectMapper.readTree(is);

        // ---- Skills ----
        JsonNode skillsNode = root.get("skills");
        if (skillsNode != null && skillsNode.isObject()) {
            skillsNode.fieldNames().forEachRemaining(category -> {
                JsonNode categoryNode = skillsNode.get(category);
                if (categoryNode != null && categoryNode.isArray()) {
                    categoryNode.forEach(skillNode -> {
                        Skill skill = new Skill();
                        skill.setCategory(category);
                        skill.setName(skillNode.asText());
                        skillRepository.save(skill);
                    });
                }
            });
        }

        // ---- Projects ----
        List<Project> allProjects = new ArrayList<>();
        Map<Integer, List<Project>> projectsByCompanyId = new HashMap<>();
        JsonNode projectsNode = root.get("projects");
        if (projectsNode != null) {
            for (JsonNode pNode : projectsNode) {
                Project project = new Project();
                project.setName(getTextOrNull(pNode, "name"));
                project.setDescription(getTextOrNull(pNode, "description"));
                project.setGithubUrl(getTextOrNull(pNode, "githubUrl"));
                project.setTechStack(getTextOrNull(pNode, "techStack"));
                JsonNode highlights = pNode.get("highlights");
                project.setHighlight(highlights != null ? toList(highlights) : null);
                project.setLiveDemoUrl(getTextOrNull(pNode, "liveDemoUrl"));

                // Prefer explicit companyId from JSON when present
                if (pNode.has("companyId") && !pNode.get("companyId").isNull()) {
                    project.setCompanyId(pNode.get("companyId").asInt());
                }

                projectRepository.save(project);
                if (project.getCompanyId() != null) {
                    projectsByCompanyId.computeIfAbsent(project.getCompanyId(), k -> new ArrayList<>()).add(project);
                }
                allProjects.add(project);
            }
        }

        // ---- Experiences ----
        List<Experience> allExperiences = new ArrayList<>();
        JsonNode experiencesNode = root.get("experiences");
        if (experiencesNode != null) {
            for (JsonNode eNode : experiencesNode) {
                Experience exp = Experience.builder()
                        .company(getTextOrNull(eNode, "company"))
                        .role(getTextOrNull(eNode, "role"))
                        .duration(getTextOrNull(eNode, "duration"))
                        .description(getTextOrNull(eNode, "description"))
                        .build();

                Set<Project> expProjects = new HashSet<>();
                Integer experienceCompanyId = null;
                JsonNode expIdNode = eNode.get("id");
                if (expIdNode != null && !expIdNode.isNull()) {
                    experienceCompanyId = expIdNode.asInt();
                }

                if (experienceCompanyId != null) {
                    List<Project> matching = projectsByCompanyId.get(experienceCompanyId);
                    if (matching != null) {
                        expProjects.addAll(matching);
                        log.debug("Assigned {} projects to experience id {}", matching.size(), experienceCompanyId);
                    } else {
                        log.debug("No projects found for experience id {}", experienceCompanyId);
                    }
                } else {
                    log.debug("Experience has no id field; no projects assigned for company {}", exp.getCompany());
                }

                exp.setProjects(expProjects);
                experienceRepository.save(exp);
                allExperiences.add(exp);
            }
        }

        // ---- Education ----
        List<Education> allEducations = new ArrayList<>();
        JsonNode educationNode = root.get("education");
        if (educationNode != null) {
            for (JsonNode eduNode : educationNode) {
                Education edu = new Education();
                edu.setInstitute(getTextOrNull(eduNode, "institute"));
                edu.setDuration(getTextOrNull(eduNode, "duration"));
                edu.setDegree(getTextOrNull(eduNode, "degree"));
                edu.setCgpa(getDoubleOrNull(eduNode, "cgpa"));
                edu.setPercentage(getTextOrNull(eduNode, "percentage"));
                edu.setBoard(getTextOrNull(eduNode, "board"));
                educationRepository.save(edu);
                allEducations.add(edu);
            }
        }

        // ---- Profile ----
        JsonNode profileNode = root.get("profile");
        if (profileNode != null) {
            Profile profile = new Profile();
            profile.setName(profileNode.get("name").asText());
            profile.setTitle(profileNode.get("title").asText());
            profile.setLocation(profileNode.get("location").asText());
            profile.setEmail(profileNode.get("email").asText());
            profile.setPhone(profileNode.get("phone").asText());
            profile.setGithub(profileNode.get("github").asText());
            profile.setLinkedin(profileNode.get("linkedin").asText());
            profile.setSummary(profileNode.get("summary").asText());
            profile.setExperiences(allExperiences);
            profile.setEducationList(allEducations);
            profileRepository.save(profile);
        }
    }

    private List<String> toList(JsonNode arrayNode) {
        List<String> list = new ArrayList<>();
        arrayNode.forEach(node -> list.add(node.asText()));
        return list;
    }

    private String getTextOrNull(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asText() : null;
    }

    private Double getDoubleOrNull(JsonNode node, String fieldName) {
        if (node.has(fieldName) && !node.get(fieldName).isNull() && !node.get(fieldName).asText().isEmpty()) {
            return node.get(fieldName).asDouble();
        }
        return null;
    }
}

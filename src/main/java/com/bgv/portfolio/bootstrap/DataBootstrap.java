package com.bgv.portfolio.bootstrap;

import com.bgv.portfolio.model.*;
import com.bgv.portfolio.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@Order(1)
public class DataBootstrap implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final ObjectMapper objectMapper;

    public DataBootstrap(ProfileRepository profileRepository,
                         SkillRepository skillRepository,
                         ProjectRepository projectRepository,
                         ExperienceRepository experienceRepository,
                         EducationRepository educationRepository,
                         ObjectMapper objectMapper) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (profileRepository.count() == 0) {
            InputStream is = new ClassPathResource("resume.json").getInputStream();
            JsonNode root = objectMapper.readTree(is);

            // ---- Skills ----
            JsonNode skillsNode = root.get("skills");
            skillsNode.fields().forEachRemaining(entry -> {
                String category = entry.getKey();
                entry.getValue().forEach(skillNode -> {
                    Skill skill = new Skill();
                    skill.setCategory(category);
                    skill.setName(skillNode.asText());
                    skillRepository.save(skill);
                });
            });

            // ---- Projects ----
            List<Project> allProjects = new ArrayList<>();
            JsonNode projectsNode = root.get("projects");
            for (JsonNode pNode : projectsNode) {
                Project project = new Project();
                project.setName(getTextOrNull(pNode, "name"));
                project.setDescription(getTextOrNull(pNode, "description"));
                project.setGithubUrl(getTextOrNull(pNode, "githubUrl"));
                project.setTechStack(getTextOrNull(pNode, "techStack"));
                project.setHighlight(toList(pNode.get("highlights")));
                project.setLiveDemoUrl(getTextOrNull(pNode, "liveDemoUrl"));
                projectRepository.save(project);
                allProjects.add(project);
            }

            // ---- Experiences ----
            List<Experience> allExperiences = new ArrayList<>();
            JsonNode experiencesNode = root.get("experiences");
            for (JsonNode eNode : experiencesNode) {
                Experience exp = Experience.builder()
                        .company(getTextOrNull(eNode, "company"))
                        .role(getTextOrNull(eNode, "role"))
                        .duration(getTextOrNull(eNode, "duration"))
                        .description(getTextOrNull(eNode, "description"))
                        .build();

                // Link projects
                Set<Project> expProjects = new java.util.HashSet<>();
                for (Project project : allProjects) {
                    // Business Auditing Tool -> Zoho
                    if ("Zoho Corporation Private Limited".equalsIgnoreCase(exp.getCompany()) &&
                            project.getName().toLowerCase().contains("audit")) {
                        expProjects.add(project);
                    }

                    // All other projects -> Cloud Ripples
                    if ("Cloud Ripples Private Limited".equalsIgnoreCase(exp.getCompany()) &&
                            !project.getName().toLowerCase().contains("audit")) {
                        expProjects.add(project);
                    }
                }

                exp.setProjects(expProjects);
                experienceRepository.save(exp);
                allExperiences.add(exp);
            }

            // ---- Education ----
            List<Education> allEducations = new ArrayList<>();
            JsonNode educationNode = root.get("education");
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

            // ---- Profile ----
            JsonNode profileNode = root.get("profile");
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

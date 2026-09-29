package com.bgv.portfolio.service;

import com.bgv.portfolio.dto.EducationDTO;
import com.bgv.portfolio.dto.ExperienceDTO;
import com.bgv.portfolio.dto.ProfileDTO;
import com.bgv.portfolio.dto.ProjectDTO;
import com.bgv.portfolio.dto.SkillDTO;
import com.bgv.portfolio.exception.ResourceNotFoundException;
import com.bgv.portfolio.storage.JsonPortfolioStore;
import com.bgv.portfolio.storage.PortfolioDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.ToLongFunction;

/** Portfolio CRUD backed by a single versioned JSON document. */
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final JsonPortfolioStore store;

    public ProfileDTO getProfile() {
        return store.read(document -> profileWithRelations(document, document.getProfile()));
    }

    public ProfileDTO getProfileById(Long id) {
        return store.read(document -> {
            if (!document.getProfile().getId().equals(id)) {
                throw notFound("Profile", id);
            }
            return profileWithRelations(document, document.getProfile());
        });
    }

    public List<SkillDTO> getSkills() {
        return store.read(document -> document.getSkills().stream().map(this::copySkill).toList());
    }

    public List<ProjectDTO> getProjects() {
        return store.read(document -> document.getProjects().stream().map(this::copyProject).toList());
    }

    public List<ExperienceDTO> getExperiences() {
        return store.read(document -> mapExperiences(document));
    }

    public List<EducationDTO> getEducation() {
        return store.read(document -> document.getEducation().stream().map(this::copyEducation).toList());
    }

    public ProjectDTO addProject(ProjectDTO dto) {
        ProjectDTO saved = store.write(document -> {
            ProjectDTO project = copyProject(dto);
            project.setId(nextId(document.getProjects(), ProjectDTO::getId));
            document.getProjects().add(project);
            return project;
        });
        return copyProject(saved);
    }

    public ProfileDTO updateProfile(Long id, ProfileDTO dto) {
        ProfileDTO saved = store.write(document -> {
            ProfileDTO current = document.getProfile();
            if (id == null || !current.getId().equals(id)) {
                throw notFound("Profile", id);
            }
            ProfileDTO updated = copyProfile(dto);
            updated.setId(id);
            document.setProfile(updated);
            return updated;
        });
        return store.read(document -> profileWithRelations(document, saved));
    }

    public void deleteSkill(Long id) {
        store.write(document -> {
            boolean removed = document.getSkills().removeIf(skill -> skill.getId().equals(id));
            if (!removed) throw notFound("Skill", id);
            return null;
        });
    }

    public ProjectDTO getProjectById(Long id) {
        return store.read(document -> copyProject(findProject(document, id)));
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        ProjectDTO saved = store.write(document -> {
            int index = indexOf(document.getProjects(), id, ProjectDTO::getId, "Project");
            ProjectDTO updated = copyProject(dto);
            updated.setId(id);
            document.getProjects().set(index, updated);
            return updated;
        });
        return copyProject(saved);
    }

    public void deleteProject(Long id) {
        store.write(document -> {
            boolean removed = document.getProjects().removeIf(project -> project.getId().equals(id));
            if (!removed) throw notFound("Project", id);
            document.getExperiences().forEach(experience -> experience.getProjectIds().remove(id));
            return null;
        });
    }

    public ExperienceDTO getExperienceById(Long id) {
        return store.read(document -> mapExperience(document, findExperience(document, id)));
    }

    public ExperienceDTO addExperience(ExperienceDTO dto) {
        Long id = store.write(document -> {
            PortfolioDocument.ExperienceRecord record = toRecord(document, dto);
            record.setId(nextId(document.getExperiences(), PortfolioDocument.ExperienceRecord::getId));
            document.getExperiences().add(record);
            return record.getId();
        });
        return getExperienceById(id);
    }

    public ExperienceDTO updateExperience(Long id, ExperienceDTO dto) {
        store.write(document -> {
            int index = indexOf(document.getExperiences(), id, PortfolioDocument.ExperienceRecord::getId, "Experience");
            PortfolioDocument.ExperienceRecord updated = toRecord(document, dto);
            updated.setId(id);
            document.getExperiences().set(index, updated);
            return null;
        });
        return getExperienceById(id);
    }

    public void deleteExperience(Long id) {
        store.write(document -> {
            boolean removed = document.getExperiences().removeIf(experience -> experience.getId().equals(id));
            if (!removed) throw notFound("Experience", id);
            return null;
        });
    }

    public EducationDTO getEducationById(Long id) {
        return store.read(document -> copyEducation(findEducation(document, id)));
    }

    public EducationDTO addEducation(EducationDTO dto) {
        EducationDTO saved = store.write(document -> {
            EducationDTO education = copyEducation(dto);
            education.setId(nextId(document.getEducation(), EducationDTO::getId));
            document.getEducation().add(education);
            return education;
        });
        return copyEducation(saved);
    }

    public EducationDTO updateEducation(Long id, EducationDTO dto) {
        EducationDTO saved = store.write(document -> {
            int index = indexOf(document.getEducation(), id, EducationDTO::getId, "Education");
            EducationDTO updated = copyEducation(dto);
            updated.setId(id);
            document.getEducation().set(index, updated);
            return updated;
        });
        return copyEducation(saved);
    }

    public void deleteEducation(Long id) {
        store.write(document -> {
            boolean removed = document.getEducation().removeIf(education -> education.getId().equals(id));
            if (!removed) throw notFound("Education", id);
            return null;
        });
    }

    public SkillDTO getSkillById(Long id) {
        return store.read(document -> copySkill(findSkill(document, id)));
    }

    public SkillDTO addSkill(SkillDTO dto) {
        SkillDTO saved = store.write(document -> {
            SkillDTO skill = copySkill(dto);
            skill.setId(nextId(document.getSkills(), SkillDTO::getId));
            document.getSkills().add(skill);
            return skill;
        });
        return copySkill(saved);
    }

    public SkillDTO updateSkill(Long id, SkillDTO dto) {
        SkillDTO saved = store.write(document -> {
            int index = indexOf(document.getSkills(), id, SkillDTO::getId, "Skill");
            SkillDTO updated = copySkill(dto);
            updated.setId(id);
            document.getSkills().set(index, updated);
            return updated;
        });
        return copySkill(saved);
    }

    private ProfileDTO profileWithRelations(PortfolioDocument document, ProfileDTO source) {
        ProfileDTO profile = copyProfile(source);
        profile.setExperiences(mapExperiences(document));
        profile.setEducationList(document.getEducation().stream().map(this::copyEducation).toList());
        return profile;
    }

    private List<ExperienceDTO> mapExperiences(PortfolioDocument document) {
        return document.getExperiences().stream().map(record -> mapExperience(document, record)).toList();
    }

    private ExperienceDTO mapExperience(PortfolioDocument document, PortfolioDocument.ExperienceRecord record) {
        Map<Long, ProjectDTO> projectsById = new LinkedHashMap<>();
        document.getProjects().forEach(project -> projectsById.put(project.getId(), project));
        Set<ProjectDTO> projects = new LinkedHashSet<>();
        record.getProjectIds().forEach(projectId -> projects.add(copyProject(projectsById.get(projectId))));
        return ExperienceDTO.builder()
                .id(record.getId())
                .company(record.getCompany())
                .role(record.getRole())
                .duration(record.getDuration())
                .description(record.getDescription())
                .projects(projects)
                .build();
    }

    private PortfolioDocument.ExperienceRecord toRecord(PortfolioDocument document, ExperienceDTO dto) {
        Set<Long> knownIds = new LinkedHashSet<>();
        document.getProjects().forEach(project -> knownIds.add(project.getId()));
        List<Long> projectIds = new ArrayList<>();
        if (dto.getProjects() != null) {
            for (ProjectDTO project : dto.getProjects()) {
                if (project.getId() == null || !knownIds.contains(project.getId())) {
                    throw new IllegalArgumentException("Experience references unknown project id: " + project.getId());
                }
                if (!projectIds.contains(project.getId())) projectIds.add(project.getId());
            }
        }
        return new PortfolioDocument.ExperienceRecord(
                dto.getId(), dto.getCompany(), dto.getRole(), dto.getDuration(), dto.getDescription(), projectIds);
    }

    private ProjectDTO findProject(PortfolioDocument document, Long id) {
        return document.getProjects().stream().filter(item -> item.getId().equals(id)).findFirst()
                .orElseThrow(() -> notFound("Project", id));
    }

    private PortfolioDocument.ExperienceRecord findExperience(PortfolioDocument document, Long id) {
        return document.getExperiences().stream().filter(item -> item.getId().equals(id)).findFirst()
                .orElseThrow(() -> notFound("Experience", id));
    }

    private EducationDTO findEducation(PortfolioDocument document, Long id) {
        return document.getEducation().stream().filter(item -> item.getId().equals(id)).findFirst()
                .orElseThrow(() -> notFound("Education", id));
    }

    private SkillDTO findSkill(PortfolioDocument document, Long id) {
        return document.getSkills().stream().filter(item -> item.getId().equals(id)).findFirst()
                .orElseThrow(() -> notFound("Skill", id));
    }

    private static <T> int indexOf(List<T> values, Long id, ToLongFunction<T> idExtractor, String type) {
        for (int index = 0; index < values.size(); index++) {
            if (id != null && idExtractor.applyAsLong(values.get(index)) == id.longValue()) return index;
        }
        throw notFound(type, id);
    }

    private static <T> long nextId(List<T> values, ToLongFunction<T> idExtractor) {
        return values.stream().mapToLong(idExtractor).max().orElse(0L) + 1L;
    }

    private static ResourceNotFoundException notFound(String type, Long id) {
        return new ResourceNotFoundException(type + " not found with id: " + id);
    }

    private ProfileDTO copyProfile(ProfileDTO source) {
        return ProfileDTO.builder().id(source.getId()).name(source.getName()).email(source.getEmail())
                .location(source.getLocation()).phone(source.getPhone()).summary(source.getSummary())
                .title(source.getTitle()).github(source.getGithub()).linkedin(source.getLinkedin()).build();
    }

    private SkillDTO copySkill(SkillDTO source) {
        return SkillDTO.builder().id(source.getId()).name(source.getName()).level(source.getLevel())
                .category(source.getCategory()).build();
    }

    private ProjectDTO copyProject(ProjectDTO source) {
        return ProjectDTO.builder().id(source.getId()).name(source.getName()).description(source.getDescription())
                .githubUrl(source.getGithubUrl()).techStack(source.getTechStack())
                .highlight(source.getHighlight() == null ? null : new ArrayList<>(source.getHighlight()))
                .liveDemoUrl(source.getLiveDemoUrl()).build();
    }

    private EducationDTO copyEducation(EducationDTO source) {
        return EducationDTO.builder().id(source.getId()).institute(source.getInstitute()).degree(source.getDegree())
                .cgpa(source.getCgpa()).percentage(source.getPercentage()).board(source.getBoard())
                .duration(source.getDuration()).build();
    }
}

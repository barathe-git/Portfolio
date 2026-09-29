package com.bgv.portfolio.storage;

import com.bgv.portfolio.dto.EducationDTO;
import com.bgv.portfolio.dto.ProjectDTO;
import com.bgv.portfolio.dto.SkillDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.function.Function;

/**
 * Thread-safe, single-process JSON document store. Writes are copy-on-write and
 * replace the target file atomically whenever the filesystem supports it.
 */
@Component
@Slf4j
public class JsonPortfolioStore {

    private static final int SUPPORTED_VERSION = 1;

    private final ObjectMapper objectMapper;
    private final Path dataPath;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock(true);
    private volatile PortfolioDocument document;

    public JsonPortfolioStore(ObjectMapper objectMapper,
                              @Value("${portfolio.data.path}") String dataPath) {
        this.objectMapper = objectMapper;
        this.dataPath = Path.of(dataPath).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void initialize() {
        lock.writeLock().lock();
        try {
            Files.createDirectories(parentDirectory());
            if (Files.notExists(dataPath)) {
                PortfolioDocument seed = readSeed();
                validate(seed);
                persist(seed);
                document = seed;
                log.info("Initialized portfolio data from bundled seed at {}", dataPath);
            } else {
                PortfolioDocument loaded = readDocument(dataPath);
                validate(loaded);
                document = loaded;
                log.info("Loaded portfolio data from {}", dataPath);
            }
        } catch (IOException | RuntimeException exception) {
            throw new IllegalStateException("Unable to initialize portfolio JSON at " + dataPath, exception);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public <T> T read(Function<PortfolioDocument, T> reader) {
        lock.readLock().lock();
        try {
            return reader.apply(copy(document));
        } finally {
            lock.readLock().unlock();
        }
    }

    public <T> T write(Function<PortfolioDocument, T> writer) {
        lock.writeLock().lock();
        try {
            PortfolioDocument candidate = copy(document);
            T result = writer.apply(candidate);
            validate(candidate);
            persist(candidate);
            document = candidate;
            return result;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to persist portfolio JSON at " + dataPath, exception);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void resetFromSeed() throws IOException {
        lock.writeLock().lock();
        try {
            PortfolioDocument seed = readSeed();
            validate(seed);
            persist(seed);
            document = seed;
            log.info("Reset portfolio data from bundled seed");
        } finally {
            lock.writeLock().unlock();
        }
    }

    Path getDataPath() {
        return dataPath;
    }

    private PortfolioDocument readSeed() throws IOException {
        ClassPathResource resource = new ClassPathResource("resume.json");
        try (InputStream input = resource.getInputStream()) {
            return objectMapper.readValue(input, PortfolioDocument.class);
        }
    }

    private PortfolioDocument readDocument(Path path) throws IOException {
        try (InputStream input = Files.newInputStream(path)) {
            return objectMapper.readValue(input, PortfolioDocument.class);
        }
    }

    private void persist(PortfolioDocument candidate) throws IOException {
        Path parent = parentDirectory();
        Files.createDirectories(parent);
        Path temporary = Files.createTempFile(parent, dataPath.getFileName().toString(), ".tmp");
        try {
            try (OutputStream output = Files.newOutputStream(temporary)) {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(output, candidate);
            }
            try {
                Files.move(temporary, dataPath, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException ignored) {
                Files.move(temporary, dataPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } finally {
            Files.deleteIfExists(temporary);
        }
    }

    private Path parentDirectory() {
        Path parent = dataPath.getParent();
        return parent != null ? parent : Path.of(".").toAbsolutePath().normalize();
    }

    private PortfolioDocument copy(PortfolioDocument source) {
        return objectMapper.convertValue(source, PortfolioDocument.class);
    }

    private void validate(PortfolioDocument candidate) {
        if (candidate == null) {
            throw new IllegalArgumentException("Portfolio document is required");
        }
        if (candidate.getVersion() != SUPPORTED_VERSION) {
            throw new IllegalArgumentException("Unsupported portfolio document version: " + candidate.getVersion());
        }
        if (candidate.getProfile() == null || !Long.valueOf(1L).equals(candidate.getProfile().getId())) {
            throw new IllegalArgumentException("Portfolio profile must have the stable id 1");
        }
        requireText(candidate.getProfile().getName(), "profile.name");
        requireText(candidate.getProfile().getEmail(), "profile.email");
        requireList(candidate.getSkills(), "skills");
        requireList(candidate.getProjects(), "projects");
        requireList(candidate.getExperiences(), "experiences");
        requireList(candidate.getEducation(), "education");

        requireUniqueIds(candidate.getSkills().stream().map(SkillDTO::getId).toList(), "skills");
        requireUniqueIds(candidate.getProjects().stream().map(ProjectDTO::getId).toList(), "projects");
        requireUniqueIds(candidate.getExperiences().stream().map(PortfolioDocument.ExperienceRecord::getId).toList(), "experiences");
        requireUniqueIds(candidate.getEducation().stream().map(EducationDTO::getId).toList(), "education");

        candidate.getSkills().forEach(skill -> {
            requireText(skill.getName(), "skill.name");
            requireText(skill.getCategory(), "skill.category");
        });
        candidate.getProjects().forEach(project -> {
            requireText(project.getName(), "project.name");
            requireText(project.getDescription(), "project.description");
        });
        candidate.getExperiences().forEach(experience -> {
            requireText(experience.getCompany(), "experience.company");
            requireText(experience.getRole(), "experience.role");
            requireText(experience.getDuration(), "experience.duration");
        });
        candidate.getEducation().forEach(education -> {
            requireText(education.getInstitute(), "education.institute");
            requireText(education.getDegree(), "education.degree");
            requireText(education.getDuration(), "education.duration");
        });

        Set<Long> projectIds = new HashSet<>(candidate.getProjects().stream().map(ProjectDTO::getId).toList());
        for (PortfolioDocument.ExperienceRecord experience : candidate.getExperiences()) {
            if (experience.getProjectIds() == null) {
                throw new IllegalArgumentException("Experience projectIds must not be null");
            }
            if (!projectIds.containsAll(experience.getProjectIds())) {
                throw new IllegalArgumentException("Experience " + experience.getId() + " references an unknown project");
            }
        }
    }

    private static void requireList(List<?> value, String name) {
        if (value == null) {
            throw new IllegalArgumentException("Portfolio " + name + " must not be null");
        }
    }

    private static void requireUniqueIds(List<Long> ids, String name) {
        if (ids.stream().anyMatch(id -> id == null || id <= 0)) {
            throw new IllegalArgumentException("Portfolio " + name + " must have positive ids");
        }
        if (new HashSet<>(ids).size() != ids.size()) {
            throw new IllegalArgumentException("Portfolio " + name + " contains duplicate ids");
        }
    }

    private static void requireText(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Portfolio " + name + " must not be blank");
        }
    }
}

package com.bgv.portfolio.storage;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.bgv.portfolio.dto.ProjectDTO;
import com.bgv.portfolio.dto.SkillDTO;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JsonPortfolioStoreTest {

    @TempDir
    Path directory;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void seedsMissingFileAndLoadsCompleteDocument() throws Exception {
        Path path = directory.resolve("nested/portfolio.json");
        JsonPortfolioStore store = createStore(path);

        assertThat(path).exists();
        assertThat(store.read(PortfolioDocument::getVersion)).isEqualTo(1);
        Long profileId = store.read(document -> document.getProfile().getId());
        List<SkillDTO> skills = store.read(PortfolioDocument::getSkills);
        List<ProjectDTO> projects = store.read(PortfolioDocument::getProjects);
        assertThat(profileId).isEqualTo(1L);
        assertThat(skills).isNotEmpty();
        assertThat(projects).hasSize(6);
    }

    @Test
    void persistsWritesAtomicallyAndReloadsThem() throws Exception {
        Path path = directory.resolve("portfolio.json");
        JsonPortfolioStore store = createStore(path);

        store.write(document -> {
            document.getProfile().setTitle("Updated title");
            return null;
        });

        JsonPortfolioStore reloaded = createStore(path);
        String reloadedTitle = reloaded.read(document -> document.getProfile().getTitle());
        assertThat(reloadedTitle).isEqualTo("Updated title");
        try (var files = Files.list(directory)) {
            assertThat(files.filter(file -> file.getFileName().toString().endsWith(".tmp"))).isEmpty();
        }
    }

    @Test
    void resetReplacesRuntimeChangesWithSeed() throws Exception {
        Path path = directory.resolve("portfolio.json");
        JsonPortfolioStore store = createStore(path);
        String seededTitle = store.read(document -> document.getProfile().getTitle());
        store.write(document -> {
            document.getProfile().setTitle("Temporary title");
            return null;
        });

        store.resetFromSeed();

        String resetTitle = store.read(document -> document.getProfile().getTitle());
        assertThat(resetTitle).isEqualTo(seededTitle);
    }

    @Test
    void malformedExistingFileFailsWithoutBeingOverwritten() throws Exception {
        Path path = directory.resolve("portfolio.json");
        Files.writeString(path, "{ definitely-not-json }");

        JsonPortfolioStore store = new JsonPortfolioStore(objectMapper, path.toString());

        assertThatThrownBy(store::initialize)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(path.toAbsolutePath().toString());
        assertThat(Files.readString(path)).isEqualTo("{ definitely-not-json }");
    }

    private JsonPortfolioStore createStore(Path path) {
        JsonPortfolioStore store = new JsonPortfolioStore(objectMapper, path.toString());
        store.initialize();
        return store;
    }
}

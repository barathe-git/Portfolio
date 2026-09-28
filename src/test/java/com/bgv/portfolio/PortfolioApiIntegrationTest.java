package com.bgv.portfolio;

import com.bgv.portfolio.storage.JsonPortfolioStore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Path;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioApiIntegrationTest {

    private static final Path DATA_PATH = Path.of(System.getProperty("java.io.tmpdir"),
            "portfolio-api-" + UUID.randomUUID() + ".json");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("portfolio.data.path", DATA_PATH::toString);
        registry.add("admin.username", () -> "test-admin");
        registry.add("admin.password", () -> "test-password");
        registry.add("jwt.secret", () -> "integration-test-secret-key-with-more-than-thirty-two-bytes");
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    JsonPortfolioStore store;

    @BeforeEach
    void resetSeed() throws Exception {
        store.resetFromSeed();
    }

    @Test
    void publicReadsDoNotRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    void configuredAdminCanLoginAndInvalidCredentialsAreRejected() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test-admin\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test-admin\",\"password\":\"test-password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("ADMIN"));
    }

    @Test
    void writesAndResetRequireAdminJwt() throws Exception {
        String project = "{\"name\":\"Protected project\",\"description\":\"JWT required\"}";
        mockMvc.perform(post("/api/projects").contentType(MediaType.APPLICATION_JSON).content(project))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/admin/reload-resume"))
                .andExpect(status().isForbidden());

        String token = loginToken();
        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(project))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(7));

        mockMvc.perform(post("/api/admin/reload-resume")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void signupEndpointIsRemoved() throws Exception {
        mockMvc.perform(post("/api/auth/signup")
                        .header("Authorization", "Bearer " + loginToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void unknownExperienceProjectIsRejectedAsBadRequest() throws Exception {
        String experience = "{\"company\":\"Example\",\"role\":\"Engineer\",\"duration\":\"2026\","
                + "\"projects\":[{\"id\":999}]}";
        mockMvc.perform(post("/api/experience")
                        .header("Authorization", "Bearer " + loginToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(experience))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("999")));
    }

    private String loginToken() throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test-admin\",\"password\":\"test-password\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode response = objectMapper.readTree(body);
        return response.path("data").path("token").asText();
    }
}

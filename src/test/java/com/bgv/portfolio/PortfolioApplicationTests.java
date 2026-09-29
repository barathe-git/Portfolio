package com.bgv.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.nio.file.Path;
import java.util.UUID;

@SpringBootTest
class PortfolioApplicationTests {
	private static final Path DATA_PATH = Path.of(System.getProperty("java.io.tmpdir"),
			"portfolio-context-" + UUID.randomUUID() + ".json");

	@DynamicPropertySource
	static void properties(DynamicPropertyRegistry registry) {
		registry.add("portfolio.data.path", DATA_PATH::toString);
	}

	@Test
	void contextLoads() {
	}

}

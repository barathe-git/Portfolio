# Build stage
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle clean build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user and writable runtime-data directory
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --create-home appuser \
    && mkdir -p /app/data \
    && chown -R appuser:appgroup /app/data
USER appuser

# Copy built JAR
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl --fail --silent http://localhost:8080/api/profile > /dev/null || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

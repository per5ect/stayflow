FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw -q -DskipTests=true dependency:go-offline

COPY src src
RUN ./mvnw -q -DskipTests=true package && \
    mv target/*.jar target/app.jar

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN groupadd -r app && useradd -r -g app app
USER app

COPY --from=build /app/target/app.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
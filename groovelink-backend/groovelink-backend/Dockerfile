FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S groovelink && adduser -S groovelink -G groovelink
COPY --from=builder /app/target/*.jar app.jar
RUN mkdir -p /tmp/groovelink/fotos-evento /tmp/groovelink/fotos-perfil && chown -R groovelink:groovelink /tmp/groovelink
USER groovelink
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

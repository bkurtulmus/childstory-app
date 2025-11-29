# Use Maven with Java 21 for the build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the entire project
COPY . .

# Navigate to the backend directory and build
WORKDIR /app/ChildStoryApp/ChildStoryApp
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Use a lightweight Java 21 runtime for the final image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/ChildStoryApp/ChildStoryApp/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

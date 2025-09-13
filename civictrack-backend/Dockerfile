# Use OpenJDK 17 as base image
FROM maven:3.8.1-openjdk-17-slim
# Set working directory
WORKDIR /app

# Copy all project files
COPY pom.xml .
COPY src src

# Download dependencies and build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/civictrack-backend-0.0.1-SNAPSHOT.jar"]
# Use a lightweight JDK 17 runtime
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the pre-built JAR file from the target directory to the container
# (We pushed this JAR to GitHub earlier)
COPY target/campuskart-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on (Default 1448 or the PORT env var)
EXPOSE 8080

# Command to run the application
# We use the PORT environment variable provided by Render
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]

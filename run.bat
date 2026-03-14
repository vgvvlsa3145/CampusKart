@echo off
setlocal EnableDelayedExpansion

echo ========================================================
echo        CampusKart - Ultimate Auto-Setup Launcher
echo ========================================================
echo Access URL: http://localhost:8081
echo =============================================================
echo.

:: Configuration
set JDK_VERSION=17.0.10_7
set JDK_DIR=jdk-17
set MAVEN_VERSION=3.9.6
set MAVEN_DIR=maven

:: 1. Setup Java (FORCING Local JDK 17 for stability)
echo [1/3] Setting up Java environment...
if exist "%JDK_DIR%" (
    echo [INFO] Using local portable JDK 17...
    goto SetupLocalJava
)

:: If we are here, jdk-17 is missing. We will download it even if global exists 
:: because global Java is causing compilation errors (TypeTag :: UNKNOWN)
echo [INFO] Downloading mandatory stable OpenJDK 17...
echo [INFO] This ensures the project runs on every system regardless of global settings.
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.10_7.zip' -OutFile 'jdk.zip'; Expand-Archive 'jdk.zip' -DestinationPath '.'; Rename-Item 'jdk-17.0.10+7' '%JDK_DIR%'; Remove-Item 'jdk.zip' -ErrorAction SilentlyContinue"

:SetupLocalJava
set "JAVA_HOME=%CD%\%JDK_DIR%"
set "PATH=%CD%\%JDK_DIR%\bin;%PATH%"
echo [INFO] Java environment ready.

:CheckMaven
:: 2. Setup Maven
echo.
echo [2/3] Setting up Maven environment...
if exist "%MAVEN_DIR%" (
    echo [INFO] Using local portable Maven...
    goto SetupLocalMaven
)

call mvn -version >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo [INFO] Global Maven detected.
    set "MAVEN_EXE=mvn"
    goto RunApp
)

echo [INFO] No Maven found. Downloading Apache Maven...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile 'maven.zip'; Expand-Archive 'maven.zip' -DestinationPath '.'; Rename-Item 'apache-maven-%MAVEN_VERSION%' '%MAVEN_DIR%'; Remove-Item 'maven.zip' -ErrorAction SilentlyContinue"

:SetupLocalMaven
set "PATH=%CD%\%MAVEN_DIR%\bin;%PATH%"
set "MAVEN_EXE=%CD%\%MAVEN_DIR%\bin\mvn.cmd"

:RunApp
:: 3. Run the Application
echo.
echo [3/3] Starting CampusKart Spring Boot Target...
echo [INFO] Performing fresh clean and start-up...
call "%MAVEN_EXE%" clean spring-boot:run -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Application failed to start!
    echo [TIP] Try deleting the 'target' folder and restarting 'run.bat'
    goto End
)

:End
echo.
echo Process finished.
pause

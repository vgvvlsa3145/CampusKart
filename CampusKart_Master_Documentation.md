# 🎓 CampusKart - Full Scratch to Deployment Guide

This document is the **Ultimate Step-by-Step Master Guide** for CampusKart. It explains precisely how to take this project from a bare folder on your Windows PC all the way to a live, permanently hosted website on the internet using Render.com.

---

## 🏗️ PART 1: Project Setup from Scratch (Local PC)

Follow these exact steps to build and run the project locally on a brand-new Windows PC.

### Step 1: Prepare the Folders
1. Open your computer Desktop.
2. Create a new folder named `campuskart`.
3. Open this folder in your code editor (e.g., Visual Studio Code).
4. Ensure you have the `pom.xml` file, the `src` folder, and the `run.bat` script inside this folder.
   *(Since you already have the code we built, this is already done!)*

### Step 2: Understand the Architecture (The "Restaurant Analogy")
Before running it, understand how the 4 pieces talk:
*   **Frontend (Dining Room Menu):** The `index.html` and `app.js` files make the screens look pretty. It waits for data.
*   **Backend (The Kitchen):** Spring Boot (Java). It receives orders, does the math, and enforces security.
*   **Database (The Pantry):** H2 (Local) or PostgreSQL (Cloud). It permanently boxes up and saves the users and orders.
*   **API (The Waiter):** The Javascript `fetch()` commands. They carry messages between the Web Browser and the Java Server.

### Step 3: Run the Auto-Setup Script (The Magic Button)
We built a script that does all the installation work for you.
1. Open the `campuskart` folder in Windows File Explorer.
2. Double-click the file named **`run.bat`**.
3. A black terminal window will open.
   - It will check if you have Java installed. If not, it secretly downloads **OpenJDK 17**.
   - It will check if you have Maven installed. If not, it secretly downloads **Apache Maven**.
   - It will then run the command `mvn spring-boot:run` to start the server!
4. Wait until the black screen says: `Started CampusKartApplication`.

### Step 4: Test the Website Locally
1. Keep the black terminal window open (do not close it!).
2. Open Google Chrome.
3. Type in the address bar: `http://localhost:8080`
4. The CampusKart website will load!
5. **Test it:** Log in with Username: `admin`, Password: `admin123`. Try adding products and checking out!

---

## 📦 PART 2: Building the Deployment Package

To put the website on the internet, you cannot just upload the raw `.java` files. You must compress them into a single machine-code file called a **JAR** (Java ARchive).

### Step 1: Stop the Local Server
1. Go to the black terminal window where the server is running.
2. Press **`Ctrl + C`** on your keyboard.
3. Type `Y` and press Enter to stop the batch job.

### Step 2: Build the JAR File
1. In Visual Studio Code, open the Terminal (Terminal -> New Terminal).
2. Type the following exact command and press Enter:
   ```bash
   mvn clean package -DskipTests
   ```
   *(If `mvn` is not recognized, simply double click `run.bat` to run the app again, which downloads maven, then close it and try again, OR use `maven\bin\mvn.cmd clean package -DskipTests`)*
3. Wait 1-3 minutes. Maven will download internet dependencies and compile your code.
4. When you see **`BUILD SUCCESS`** in green text, you are done!

### Step 3: Find your JAR File
1. In your project folder, a new folder named `target` just magically appeared.
2. Open the `target` folder.
3. Find the file named **`campuskart-0.0.1-SNAPSHOT.jar`**.
4. **Action:** Copy this file and paste it onto your Windows Desktop. You will need it in 5 minutes!

---

## ☁️ PART 3: Cloud Deployment (Render.com)

We will now put your JAR file on the internet permanently, for free, using Render.com.

### Step 1: Create a Render Account
1. Open Google Chrome and go to: **https://render.com**
2. Click **"Get Started for Free"**.
3. Click **"Continue with Google"**. (You do NOT need a GitHub account).

### Step 2: Create a Persistent Database
Currently, your app uses "H2 In-Memory". This wipes all data when the server restarts. To save users forever, we must create a free PostgreSQL database.
1. On the Render Dashboard, click the **"New +"** button at the top right.
2. Click **"PostgreSQL"**.
3. Fill in the form:
   *   **Name:** `campuskart-db`
   *   **Region:** Singapore
   *   **PostgreSQL Version:** 16
   *   **Plan:** Free
4. Click **"Create Database"** at the bottom.
5. Wait 2 minutes for the status to turn green and say **"Available"**.
6. Under the "Connections" section, COPY and SAVE these 3 values into a Notepad file:
   *   **Internal Database URL** (e.g. `postgres://...`)
   *   **Username**
   *   **Password**

### Step 3: Deploy the Web Server
1. Go back to the main Render Dashboard.
2. Click **"New +"** -> **"Web Service"**.
3. Since you are not using GitHub, select the option to **"Deploy an existing image or public repo"** -> **Upload Files**.
4. Select the `campuskart-0.0.1-SNAPSHOT.jar` file from your Windows Desktop.
5. Fill in the Configuration form:
   *   **Name:** `campuskart`
   *   **Environment:** `Java`
   *   **Region:** Singapore
   *   **Start Command:** `java -jar campuskart-0.0.1-SNAPSHOT.jar`
   *   **Plan:** Free

### Step 4: Link the Database (Crucial!)
1. On that exact same Web Service creation page, scroll down to **"Environment Variables"**.
2. Click **"Add Environment Variable"**. Add these 3 rows using the notepad values you saved in Step 2:
   *   Key: `DATABASE_URL` | Value: *(Paste Internal Database URL here)*
   *   Key: `DATABASE_USER` | Value: *(Paste Username here)*
   *   Key: `DATABASE_PASS` | Value: *(Paste Password here)*
3. Add one more row for the port:
   *   Key: `PORT` | Value: `8080`

### Step 5: Go Live! 🚀
1. Click the big **"Create Web Service"** button.
2. Render will begin deploying your code. You will see live terminal logs.
3. Wait 3-5 minutes.
4. When the logs say `Started CampusKartApplication`, look at the top-left of the screen.
5. Render has generated a permanent public URL for you (e.g., `https://campuskart-xyz.onrender.com`).
6. Click that link! Your e-commerce website is now live on the internet, backed by a permanent database, and accessible to anyone in the world!

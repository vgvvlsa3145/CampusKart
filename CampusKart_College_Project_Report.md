# A PROJECT REPORT ON

## "CAMPUSKART: A SCALABLE FULL-STACK E-COMMERCE PLATFORM"

**Submitted in partial fulfillment of the requirements for the award of the degree of**
**BACHELOR OF TECHNOLOGY / SCIENCE**

---

## 1. ABSTRACT

The rapid digitization of global commerce has established web-based retail as a cornerstone of modern economics. To facilitate this digital transformation, software engineering paradigms have shifted towards highly scalable, decoupled architectures. This project report presents the design, development, and deployment of "CampusKart," a comprehensive Full-Stack E-Commerce web application. 

CampusKart is engineered to provide a seamless, high-performance shopping experience. It operates on a robust Three-Tier Client-Server Architecture. The presentation layer (Frontend) is developed as a responsive Single Page Application (SPA) utilizing HTML5, CSS3, and asynchronous Vanilla JavaScript (ES6), eliminating performance bottlenecks associated with full-page reloading. The application layer (Backend) is powered by Java 17 and the Spring Boot framework, providing a secure, high-throughput RESTful API. Data persistence is managed via Spring Data JPA utilizing an in-memory SQL database (H2) for dynamic local testing, with cloud-native PostgreSQL integration for production environments. 

The system successfully implements complex e-commerce workflows including dynamic product cataloging, stateful cart management, simulated payment gateway integration via UPI, and chronological order tracking. Security is strictly enforced using Spring Security to guarantee Role-Based Access Control (RBAC), establishing a secure administrative ecosystem. The project concludes with a custom CI/CD deployment package, demonstrating modern industry standards for software delivery and internet hosting.

---

## 2. INTRODUCTION

### 2.1 Background of the Study
The transition from traditional retail to electronic commerce requires sophisticated software solutions capable of handling concurrent users, secure transactions, and dynamic data presentation. Modern e-commerce platforms must not only look aesthetically pleasing but must be architecturally sound to prevent security breaches and data loss.

### 2.2 Objectives of the Project
The primary objectives of the CampusKart development lifecycle are:
1. To design a decoupled, REST-driven web architecture separating client-side rendering from server-side business logic.
2. To build a responsive, intuitive, and dynamic user interface inspired by premium e-commerce design languages (e.g., Material UI).
3. To develop a secure backend infrastructure capable of handling user authentication and strict authorization protocols.
4. To implement a complete shopping flow from product discovery to simulated financial checkout and logistics tracking.
5. To create a highly portable application environment utilizing automated dependency resolution scripts for zero-friction local execution.

---

## 3. LITERATURE REVIEW AND TECHNOLOGY SELECTION

The technology stack was chosen to reflect current industry standards for enterprise web applications.

### 3.1 Frontend Technologies
*   **HTML5 / CSS3:** Chosen for semantic document structuring and CSS Grid/Flexbox layouts to guarantee visual responsiveness across mobile and desktop viewports.
*   **Vanilla JavaScript (ES6+):** Selected over heavy frameworks (like React or Angular) to demonstrate a deep, fundamental understanding of the Document Object Model (DOM) and the asynchronous `Fetch API`.

### 3.2 Backend Technologies
*   **Java (JDK 17):** Utilized for its strong typing, object-oriented principles, and unmatched enterprise ecosystem.
*   **Spring Boot (v 3.2.4):** Chosen to rapidly develop production-ready Spring applications. It drastically reduces boilerplate configuration and integrates an embedded Apache Tomcat web server.
*   **Spring Security:** Deployed to intercept and authenticate `HTTP` requests, ensuring data integrity and authorization.

### 3.3 Database and Persistence
*   **H2 Database:** An embedded, relational database management system written in Java. Used for rapid prototyping and zero-configuration local execution.
*   **PostgreSQL:** Selected as the production-grade, open-source object-relational database system for cloud deployment due to its proven architecture and robust feature set.
*   **Spring Data JPA (Hibernate):** Implements the Object-Relational Mapping (ORM) technique, allowing the translation of Java Objects (`@Entity`) directly into structured SQL commands.

---

## 4. SYSTEM ANALYSIS AND DESIGN

### 4.1 System Architecture
The application utilizes a definitive **Three-Tier Architecture**:
1.  **Client Tier (Presentation):** The user's web browser parses the HTML/CSS and executes the JavaScript. It communicates entirely by sending JSON payloads via HTTP `GET`, `POST`, `PUT`, and `DELETE` methods.
2.  **Application Tier (Logic):** The Spring Boot server receives these HTTP requests via designated Controller endpoints (`@RestController`). The Controllers pass data payloads to Service classes which execute the core mathematical and business logic.
3.  **Data Tier (Persistence):** The Service layer communicates with Repository Interfaces to execute CRUD (Create, Read, Update, Delete) operations on the database.

### 4.2 Security Architecture (RBAC)
Role-Based Access Control is enforced at the network permutation level.
*   **Anonymous Client:** Granted `READ` access to the homepage and limited products.
*   **Authenticated `ROLE_CUSTOMER`:** Granted `READ` access to the full catalog, and `POST` access to submit orders and view their specific order history.
*   **Authenticated `ROLE_ADMIN`:** Granted full `CRUD` access to the product inventory, and global visibility of all orders across the platform for fulfillment tracking.

### 4.3 Database Schema Design (Entity Models)
The relational database is normalized and consists of three primary tables:
1.  **Users Table:** Stores `id`, `username`, encrypted `password`, and `role`.
2.  **Products Table:** Stores inventory catalog including `id`, `name`, `price`, `description`, `category`, and `image_url`.
3.  **Orders Table:** A complex join table storing the `user_id`, a serialized list of `OrderItem` models, `total_amount`, `payment_status`, customized `delivery_address`, and the chronological `status` (Placed, Shipped, Delivered).

### 4.4 Project Folder Structure
The source code is systematically organized to enforce the separation of concerns characteristic of Spring Boot MVC applications:

```text
campuskart/
├── pom.xml                               # Defines Maven dependencies (Spring, JPA, H2, PostgreSQL)
├── run.bat                               # Custom automated setup & execution script
├── src/main/java/com/campuskart/         # Backend Java Source Code
│   ├── CampusKartApplication.java        # Spring Boot Main Entry Point
│   ├── config/                           
│   │   └── SecurityConfig.java           # RBAC and session security filters
│   ├── controller/                       # REST API Endpoints 
│   │   ├── AuthController.java
│   │   ├── OrderController.java
│   │   └── ProductController.java
│   ├── model/                            # JPA Database Blueprints (Entities)
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Product.java
│   │   └── User.java
│   ├── repository/                       # Spring Data Database Access Interfaces
│   │   ├── OrderRepository.java
│   │   ├── ProductRepository.java
│   │   └── UserRepository.java
│   └── service/                          # Core Business Logic and calculations
│       ├── CustomUserDetailsService.java
│       ├── DataSeeder.java               # Auto-generates initial products & admin on boot
│       ├── OrderService.java
│       └── ProductService.java
└── src/main/resources/                   # Frontend UI and App Configuration
    ├── application.properties            # Dual DB config (H2 local / PostgreSQL cloud)
    └── static/                           # Client-side SPA Assets
        ├── index.html                    # Main UI skeleton and modals
        ├── css/
        │   └── style.css                 # Premium layout styling and animations
        └── js/
            └── app.js                    # Dynamic DOM rendering and fetch() API calls
```

---

## 5. SYSTEM IMPLEMENTATION AND MODULE OVERVIEW

### 5.1 The User Interface Module
The UI was meticulously crafted to ensure a premium user experience. It features asynchronous state management. For example, when an item is added to the cart, the DOM is updated instantly without a page refresh, mimicking native application speed.

### 5.2 The Checkout and Payment Simulation Module
A critical technical hurdle was the checkout flow. The client-side JavaScript aggregates the shopping cart object and captures string input for the physical delivery address. This data is serialized into a JSON string and transmitted to the server. The UI then triggers an asynchronous simulated payment processing animation (displaying a mock UPI QR configuration) pending the server's `200 OK` HTTP response. upon success.

### 5.3 Administrative Dashboard Module
The backend verifies the Session Cookie of any request to `/api/admin/`. If authorized, the admin is presented with specialized UI panels allowing direct mutation of the underlying database, including modifying inventory constraints and updating logistics tracking strings.

---

## 6. DEPLOYMENT AND EXECUTION INSTRUCTION

### 6.1 Automated Local CI/CD Scripting
To eliminate the classic "Works on my machine" deployment failure, a custom Windows Batch Script (`run.bat`) was engineered. Utilizing PowerShell execution policies, the script probes the host Operating System for Java and Maven binaries. Upon a negative result, it dynamically downloads, extracts, and temporarily maps portable distributions of OpenJDK 17 and Apache Maven into the local `PATH` variables, executing the full Spring Boot lifecycle automatically.

### 6.2 Cloud Hosting Strategy
The application is validated for production cloud deployment via `Render.com`. 
1. The codebase is packaged into an executable `.jar` file using the `maven-spring-boot-plugin`.
2. The application properties are dual-configured to sniff environment variables (`DATABASE_URL`), dynamically switching the underlying database dialect from H2 to PostgreSQL upon successful cloud deployment.

---

## 7. CONCLUSION AND FUTURE SCOPE

The "CampusKart" project stands as a complete and highly successful validation of full-stack engineering principles. It proves the efficacy of decoupling the frontend presentation layer from the backend data layer, resulting in software that is scalable, secure, and performant.

**Future Enhancements could include:**
1. Integration of a real-world payment gateway (e.g., Stripe or Razorpay API).
2. Implementation of JWT (JSON Web Tokens) for stateless authentication.
3. Microservices separation, modularizing the Product Catalog and the Order Processing logic into distinct, independent server clusters.

---
**-- END OF PROJECT REPORT --**

# 💻 CampusKart - Full Source Code Appendix

This document contains the complete source code for the CampusKart project, organized by file for easy copy-pasting.

---

### FILE: `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.4</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>
  <groupId>com.campuskart</groupId>
  <artifactId>campuskart</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>campuskart</name>
  <description>CampusKart Full Stack Mini Project</description>
  <properties>
    <java.version>17</java.version>
    <lombok.version>1.18.34</lombok.version>
  </properties>
  <dependencies>
    <!-- Spring Web for REST APIs -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA for Database Access -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Security for Authentication & Roles -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- H2 In-Memory Database (used for LOCAL development) -->
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- PostgreSQL Driver (used for CLOUD/Render deployment) -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok to reduce boilerplate code -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.13.0</version>
        <configuration>
          <release>17</release>
          <annotationProcessorPaths>
            <path>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
              <version>${lombok.version}</version>
            </path>
          </annotationProcessorPaths>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
    </plugins>
  </build>

</project>
```

---

### FILE: `run.bat`

```batch
@echo off
setlocal EnableDelayedExpansion

echo ========================================================
echo        CampusKart - Ultimate Auto-Setup Launcher
echo ========================================================
echo Access URL: http://localhost:8081
echo =============================================================
echo.
echo This script will automatically download any missing dependencies
echo like Java and Maven to run this application completely standalone!
echo.

:: Configuration
set JDK_VERSION=17.0.10_7
set JDK_DIR=jdk-17
set MAVEN_VERSION=3.9.6
set MAVEN_DIR=maven

:: 1. Check and Setup Java
echo [1/3] Checking Java Development Kit (JDK 17)...
call java -version >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo [INFO] Global Java detected.
    goto CheckMaven
)

echo [INFO] Global Java NOT found. Checking for local portable JDK...
if exist "%JDK_DIR%" goto SetupLocalJava

echo [INFO] Downloading portable OpenJDK 17. This may take a few minutes...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.10_7.zip' -OutFile 'jdk.zip'; Expand-Archive 'jdk.zip' -DestinationPath '.'; Rename-Item 'jdk-17.0.10+7' '%JDK_DIR%'; Remove-Item 'jdk.zip'"

:SetupLocalJava
echo [INFO] Configuring local portable JDK environment...
set "JAVA_HOME=%CD%\%JDK_DIR%"
set "PATH=%CD%\%JDK_DIR%\bin;%PATH%"

:CheckMaven
:: 2. Check and Setup Maven
echo.
echo [2/3] Checking Maven...
call mvn -version >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo [INFO] Global Maven detected.
    goto RunApp
)

echo [INFO] Global Maven NOT found. Checking for local portable Maven...
if exist "%MAVEN_DIR%" goto SetupLocalMaven

echo [INFO] Downloading Apache Maven. This may take a minute...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile 'maven.zip'; Expand-Archive 'maven.zip' -DestinationPath '.'; Rename-Item 'apache-maven-%MAVEN_VERSION%' '%MAVEN_DIR%'; Remove-Item 'maven.zip'"

:SetupLocalMaven
echo [INFO] Configuring local portable Maven environment...
set "PATH=%CD%\%MAVEN_DIR%\bin;%PATH%"
set "MAVEN_EXE=%CD%\%MAVEN_DIR%\bin\mvn.cmd"

:RunApp
:: 3. Run the Application
echo.
echo [3/3] Starting CampusKart Spring Boot Target...
echo [INFO] Maven is now downloading all project dependencies... (First time takes a while)
call "%MAVEN_EXE%" clean spring-boot:run -DskipTests
goto End

pause

:End
```

---

### FILE: `src\main\java\com\campuskart\CampusKartApplication.java`

```java
package com.campuskart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusKartApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusKartApplication.class, args);
    }
}
```

---

### FILE: `src\main\java\com\campuskart\config\DataSeeder.java`

```java
package com.campuskart.config;

import com.campuskart.model.Product;
import com.campuskart.model.User;
import com.campuskart.repository.ProductRepository;
import com.campuskart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.findByUsername("admin").isEmpty()) {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole(User.Role.ADMIN);
                        userRepository.save(admin);
                        System.out.println("Admin user created: admin / admin123");
                }

                if (productRepository.count() == 0) {
                        Product p1 = new Product();
                        p1.setName("CampusKart Elite Wireless Headphones");
                        p1.setPrice(4999.00);
                        p1.setCategory("Electronics");
                        p1.setDescription("Premium noise-canceling wireless headphones with 40-hour battery life.");
                        p1.setImageUrl(
                                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000");

                        Product p2 = new Product();
                        p2.setName("CampusKart Smartwatch Pro");
                        p2.setPrice(2499.00);
                        p2.setCategory("Electronics");
                        p2.setDescription(
                                        "Track your fitness, heart rate, and notifications on the go with a vibrant OLED display.");
                        p2.setImageUrl(
                                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000");

                        Product p3 = new Product();
                        p3.setName("Ergonomic Desk Chair");
                        p3.setPrice(7500.00);
                        p3.setCategory("Furniture");
                        p3.setDescription("Comfortable mesh back chair designed for long study or work sessions.");
                        p3.setImageUrl(
                                        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000");

                        Product p4 = new Product();
                        p4.setName("Minimalist Ceramic Coffee Mug");
                        p4.setPrice(299.00);
                        p4.setCategory("Home & Kitchen");
                        p4.setDescription("12 oz ceramic mug perfect for your morning brew.");
                        p4.setImageUrl(
                                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000");

                        productRepository.save(p1);
                        productRepository.save(p2);
                        productRepository.save(p3);
                        productRepository.save(p4);
                        System.out.println("Sample products created.");
                }
        }
}
```

---

### FILE: `src\main\java\com\campuskart\config\SecurityConfig.java`

```java
package com.campuskart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabled for simplicity in mini-project
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**", "/h2-console/**",
                                "/api/auth/**")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/products/**")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // For H2 console
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

---

### FILE: `src\main\java\com\campuskart\controller\AuthController.java`

```java
package com.campuskart.controller;

import com.campuskart.model.User;
import com.campuskart.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            // Explicitly create session
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            String username = auth.getName();
            User user = userRepository.findByUsername(username).get();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", user.getUsername());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userDetails) {
        String username = userDetails.get("username");
        String password = userDetails.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Optional<User> userOpt = userRepository.findByUsername(auth.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("role", user.getRole().name());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out");
    }
}
```

---

### FILE: `src\main\java\com\campuskart\controller\OrderController.java`

```java
package com.campuskart.controller;

import com.campuskart.model.Order;
import com.campuskart.model.OrderDTO;
import com.campuskart.model.User;
import com.campuskart.repository.UserRepository;
import com.campuskart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    // Customer API: Checkout
    @PostMapping("/api/orders/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderDTO.CheckoutRequest request) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        try {
            Order order = orderService.placeOrder(user, request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Checkout failed: " + e.getMessage());
        }
    }

    // Customer API: My Orders
    @GetMapping("/api/orders/my-orders")
    public ResponseEntity<?> getMyOrders() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }

    // Admin API: All Orders
    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin API: Update Order Status
    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
```

---

### FILE: `src\main\java\com\campuskart\controller\ProductController.java`

```java
package com.campuskart.controller;

import com.campuskart.model.Product;
import com.campuskart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Public API
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Public API
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin API
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Admin API
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
```

---

### FILE: `src\main\java\com\campuskart\model\Order.java`

```java
package com.campuskart.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders") // Custom name to avoid reserved word conflicts
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double totalAmount;

    @Column(nullable = false)
    private String status; // e.g., PLACED, SHIPPED, DELIVERED

    @Column(nullable = false)
    private String paymentStatus; // e.g., PAID

    private String deliveryAddress;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> items;
}
```

---

### FILE: `src\main\java\com\campuskart\model\OrderDTO.java`

```java
package com.campuskart.model;

import lombok.Data;
import java.util.List;

public class OrderDTO {

    @Data
    public static class CheckoutRequest {
        private List<CartItem> items;
        private Double totalAmount;
        private String paymentStatus;
        private String deliveryAddress;
    }

    @Data
    public static class CartItem {
        private Long productId;
        private Integer quantity;
        private Double price;
    }
}
```

---

### FILE: `src\main\java\com\campuskart\model\OrderItem.java`

```java
package com.campuskart.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private Double price;
}
```

---

### FILE: `src\main\java\com\campuskart\model\Product.java`

```java
package com.campuskart.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private String imageUrl;

    private String category;
}
```

---

### FILE: `src\main\java\com\campuskart\model\User.java`

```java
package com.campuskart.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public enum Role {
        ADMIN, CUSTOMER
    }
}
```

---

### FILE: `src\main\java\com\campuskart\repository\OrderRepository.java`

```java
package com.campuskart.repository;

import com.campuskart.model.Order;
import com.campuskart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findAllByOrderByCreatedAtDesc();
}
```

---

### FILE: `src\main\java\com\campuskart\repository\ProductRepository.java`

```java
package com.campuskart.repository;

import com.campuskart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
```

---

### FILE: `src\main\java\com\campuskart\repository\UserRepository.java`

```java
package com.campuskart.repository;

import com.campuskart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
```

---

### FILE: `src\main\java\com\campuskart\service\CustomUserDetailsService.java`

```java
package com.campuskart.service;

import com.campuskart.model.User;
import com.campuskart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
```

---

### FILE: `src\main\java\com\campuskart\service\OrderService.java`

```java
package com.campuskart.service;

import com.campuskart.model.*;
import com.campuskart.repository.OrderRepository;
import com.campuskart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(User user, OrderDTO.CheckoutRequest request) {
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PLACED");
        order.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PENDING");
        order.setDeliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : "N/A");

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderDTO.CartItem cartItem : request.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found");
    }
}
```

---

### FILE: `src\main\java\com\campuskart\service\ProductService.java`

```java
package com.campuskart.service;

import com.campuskart.model.Product;
import com.campuskart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setImageUrl(productDetails.getImageUrl());
            product.setCategory(productDetails.getCategory());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```

---

### FILE: `src\main\resources\application.properties`

```properties
spring.application.name=campuskart

# ================================================================
# DATABASE CONFIGURATION
# This setup automatically detects whether you are running
# locally (uses H2) or on a cloud server like Render (uses PostgreSQL).
# ================================================================

# If DATABASE_URL is set (Render sets this automatically), use PostgreSQL.
# Otherwise, fall back to the local H2 in-memory database.
spring.datasource.url=${DATABASE_URL:jdbc:h2:mem:campuskartdb}
spring.datasource.username=${DATABASE_USER:sa}
spring.datasource.password=${DATABASE_PASS:password}

# Driver: Spring Boot auto-detects based on the URL above.
# Dialect: Auto-detect based on connected database.
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# H2 Web Console (only works locally, harmless when on cloud)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Server Configuration — Render sets PORT automatically via environment
server.port=${PORT:8081}
```

---

### FILE: `src\main\resources\static\index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CampusKart | Online Shopping</title>
    <link rel="stylesheet" href="/css/style.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-left">
                <div class="logo" onclick="app.navigate('home')">
                    <i>Campus</i>Kart
                </div>
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search for products, brands and more">
                    <button class="search-btn"><span class="material-icons">search</span></button>
                </div>
            </div>
            <div class="nav-right" id="navRight">
                <!-- Dynamically populated by JS based on Auth state -->
            </div>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main id="app-content">
        <!-- Views will be injected here -->
    </main>

    <!-- Modals -->
    <!-- Login Modal -->
    <div id="authModal" class="modal">
        <div class="modal-content auth-dialog">
            <div class="auth-left">
                <h2>Login</h2>
                <p>Get access to your Orders, Wishlist and Recommendations</p>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                    alt="Login">
            </div>
            <div class="auth-right">
                <button class="close-modal" onclick="ui.closeModal('authModal')">&times;</button>
                <form id="loginForm" onsubmit="app.handleLogin(event)">
                    <div class="form-group">
                        <input type="text" id="loginUsername" required placeholder=" ">
                        <label>Username</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="loginPassword" required placeholder=" ">
                        <label>Password</label>
                    </div>
                    <p class="error-msg" id="loginError"></p>
                    <button type="submit" class="btn btn-primary" style="width:100%">Login</button>
                </form>
                <div class="auth-switch">
                    New to CampusKart? <a href="#" onclick="app.showRegister()">Create an account</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div id="registerModal" class="modal">
        <div class="modal-content auth-dialog">
            <div class="auth-left">
                <h2>Looks like you're new here!</h2>
                <p>Sign up with your details to get started</p>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                    alt="Register">
            </div>
            <div class="auth-right">
                <button class="close-modal" onclick="ui.closeModal('registerModal')">&times;</button>
                <form id="registerForm" onsubmit="app.handleRegister(event)">
                    <div class="form-group">
                        <input type="text" id="regUsername" required placeholder=" ">
                        <label>Choose Username</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="regPassword" required placeholder=" ">
                        <label>Choose Password</label>
                    </div>
                    <p class="error-msg" id="regError"></p>
                    <button type="submit" class="btn btn-primary" style="width:100%">Continue</button>
                    <button type="button" class="btn btn-secondary mt-10" style="width:100%"
                        onclick="app.showLogin()">Existing User? Log in</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Notification Toast -->
    <div id="toast" class="toast"></div>

    <!-- Fake Payment Modal -->
    <div id="paymentModal" class="modal">
        <div class="modal-content payment-dialog">
            <h2>Secure Payment <span class="material-icons"
                    style="color:var(--success-color); vertical-align:middle;">verified_user</span></h2>
            <div class="payment-amount">Total: ₹<span id="payAmount">0</span></div>

            <div id="qrCodeContainer" class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=campuskart@okicici&pn=CampusKart&am=amount"
                    alt="UPI QR Code" class="qr-image">
                <p class="mt-10 mb-20" style="color:var(--text-light); font-size:14px;">Scan with any UPI App (GPay,
                    PhonePe, Paytm)</p>
            </div>

            <div class="payment-methods">
                <div class="pay-method selected">UPI / QR SCAN</div>
                <div class="pay-method">Cash On Delivery</div>
                <div class="pay-method">Credit/Debit Card</div>
            </div>

            <div class="form-group mt-20 text-left">
                <label
                    style="position:static; font-size:14px; color:var(--text-light); margin-bottom:5px; display:block;">Delivery
                    Address</label>
                <textarea id="deliveryAddress" rows="3"
                    style="width:100%; border:1px solid var(--border-color); padding:10px; border-radius:4px; font-family:inherit; resize:vertical;"
                    placeholder="Enter your full campus delivery address..." required></textarea>
            </div>

            <div class="payment-loading" id="payLoading" style="display:none;">
                <div class="spinner"></div>
                <h3 class="mt-10" style="color: var(--primary-color);">Processing your payment securely...</h3>
                <p class="small-text mt-10" style="color: var(--text-light);">Please do not refresh the page or press
                    back button</p>
            </div>

            <div class="payment-success" id="paymentSuccess" style="display:none;">
                <div class="success-checkmark">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>
                <h3 class="mt-10" style="color: var(--success-color);">Payment Successful!</h3>
                <p class="mt-10 small-text">Order confirmed.</p>
            </div>

            <button class="btn btn-primary" id="btnPayNow" onclick="app.processPayment()">Simulate Successful
                Payment</button>
            <button class="btn btn-secondary mt-10" onclick="ui.closeModal('paymentModal')"
                style="width: 100%;">Cancel</button>
        </div>
    </div>

    <script src="/js/app.js"></script>
</body>

</html>
```

---

### FILE: `src\main\resources\static\css\style.css`

```css
:root {
    --primary-color: #2874f0;
    --primary-hover: #1e5fc8;
    --secondary-color: #fb641b;
    --text-dark: #212121;
    --text-light: #878787;
    --bg-color: #f1f3f6;
    --white: #ffffff;
    --border-color: #f0f0f0;
    --success-color: #388e3c;
    --danger-color: #ff6161;
    --font-family: 'Roboto', sans-serif;
    --shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-dark);
}

/* Typography */
h1,
h2,
h3 {
    font-weight: 500;
}

a {
    text-decoration: none;
    color: inherit;
}

.mt-10 {
    margin-top: 10px;
}

.mb-20 {
    margin-bottom: 20px;
}

.text-center {
    text-align: center;
}

/* Buttons */
.btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .1);
    transition: background 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--white);
}

.btn-primary:hover {
    background-color: var(--primary-hover);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
}

.btn-secondary {
    background-color: var(--white);
    color: var(--primary-color);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
}

.btn-danger {
    background-color: var(--danger-color);
    color: var(--white);
}

.btn-buy-now {
    background-color: var(--secondary-color);
    color: var(--white);
}

/* Navbar */
.navbar {
    background-color: var(--primary-color);
    height: 56px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    width: 100%;
    max-width: 1248px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-left {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.logo {
    color: var(--white);
    font-size: 20px;
    font-style: italic;
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;
}

.logo i {
    color: #ffe500;
}

.search-bar {
    display: flex;
    flex-grow: 1;
    max-width: 500px;
    background: var(--white);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .13);
}

.search-bar input {
    width: 100%;
    padding: 10px 16px;
    border: none;
    outline: none;
    font-size: 14px;
}

.search-btn {
    background: var(--white);
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    color: var(--primary-color);
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 30px;
}

.nav-item {
    color: var(--white);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-item.login-btn {
    background: var(--white);
    color: var(--primary-color);
    padding: 5px 40px;
    border-radius: 2px;
}

/* Main Layout */
main {
    max-width: 1248px;
    margin: 10px auto;
    padding: 10px;
    min-height: calc(100vh - 80px);
    /* 56px nav + margins */
}

/* Grid & Cards */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
}

.card {
    background: var(--white);
    border-radius: 2px;
    padding: 15px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.3s;
}

.product-card {
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .11);
}

.product-card img {
    max-width: 100%;
    height: 200px;
    object-fit: contain;
    margin-bottom: 15px;
}

.product-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-price {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-dark);
    margin-top: auto;
}

.product-category {
    font-size: 12px;
    color: var(--text-light);
    margin-bottom: 10px;
}

/* Modals & Dialogs */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--white);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.auth-dialog {
    display: flex;
    width: 700px;
    height: 500px;
}

.auth-left {
    width: 40%;
    background-color: var(--primary-color);
    color: var(--white);
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
}

.auth-left h2 {
    font-size: 28px;
    margin-bottom: 15px;
    font-weight: 500;
}

.auth-left p {
    font-size: 18px;
    color: #dbdbdb;
    line-height: 1.5;
}

.auth-left img {
    margin-top: auto;
    width: 100%;
    align-self: center;
}

.auth-right {
    width: 60%;
    padding: 50px 35px;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-light);
}

/* Material Inputs */
.form-group {
    position: relative;
    margin-bottom: 30px;
}

.form-group input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
    font-size: 16px;
    outline: none;
    background: transparent;
    transition: border-color 0.2s;
}

.form-group input:focus {
    border-bottom: 1px solid var(--primary-color);
}

.form-group label {
    position: absolute;
    top: 10px;
    left: 0;
    color: var(--text-light);
    font-size: 16px;
    transition: 0.2s ease all;
    pointer-events: none;
}

.form-group input:focus~label,
.form-group input:not(:placeholder-shown)~label {
    top: -10px;
    font-size: 12px;
    color: var(--text-light);
}

.error-msg {
    color: var(--danger-color);
    font-size: 12px;
    margin-bottom: 15px;
    min-height: 15px;
}

.auth-switch {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--text-light);
    font-size: 14px;
}

.auth-switch a {
    color: var(--primary-color);
    font-weight: 500;
}

/* Toast */
.toast {
    position: fixed;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: #323232;
    color: #fff;
    padding: 12px 24px;
    border-radius: 2px;
    font-size: 14px;
    z-index: 2000;
    transition: bottom 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.toast.show {
    bottom: 30px;
}

/* Views Containers */
.view {
    display: none;
}

.view.active {
    display: block;
}

/* Spinner */
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 15px auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Utility layout components for views generated via JS */
.flex-row {
    display: flex;
    gap: 20px;
}

.flex-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2;
}

.flex-3 {
    flex: 3;
}

/* specific components */
.cart-item {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid var(--border-color);
    padding: 20px 0;
}

.cart-item img {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.qty-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
}

.qty-btn {
    border: 1px solid #c2c2c2;
    background: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.order-timeline {
    position: relative;
    padding-left: 30px;
    margin-top: 20px;
}

.order-timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    height: 100%;
    width: 2px;
    background: #e0e0e0;
}

.timeline-item {
    position: relative;
    margin-bottom: 20px;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: -28px;
    top: 5px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e0e0e0;
    border: 2px solid white;
}

.timeline-item.active::before {
    background: var(--success-color);
}

/* Table for Admin */
.admin-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
}

.admin-table th,
.admin-table td {
    padding: 12px;
    border: 1px solid var(--border-color);
    text-align: left;
}

.admin-table th {
    background: #f9f9f9;
    font-weight: 500;
}

.payment-dialog {
    width: 400px;
    padding: 30px;
    text-align: center;
}

.payment-dialog h2 {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.payment-amount {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
}

.pay-method {
    border: 1px solid var(--border-color);
    padding: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.2s;
}

.pay-method:hover {
    border-color: var(--primary-color);
}

.pay-method.selected {
    border-color: var(--primary-color);
    background: #f0f5ff;
    font-weight: 500;
}

/* Simple Empty State */
.empty-state {
    text-align: center;
    padding: 50px 20px;
    background: white;
    margin-top: 20px;
}

.empty-state img {
    width: 200px;
    margin-bottom: 20px;
}
/* QR Code & Payment Success Animation Styling */
.qr-container { margin: 20px auto; display: none; }
.qr-image { border: 1px solid var(--border-color); padding: 10px; border-radius: 8px; background: white; width: 150px; height: 150px;}

.success-checkmark {
    width: 80px;
    height: 115px;
    margin: 0 auto;
    
    .check-icon {
        width: 80px;
        height: 80px;
        position: relative;
        border-radius: 50%;
        box-sizing: content-box;
        border: 4px solid #4CAF50;
        
        &::before {
            top: 3px;
            left: -2px;
            width: 30px;
            transform-origin: 100% 50%;
            border-radius: 100px 0 0 100px;
        }
        
        &::after {
            top: 0;
            left: 30px;
            width: 60px;
            transform-origin: 0 50%;
            border-radius: 0 100px 100px 0;
            animation: rotate-circle 4.25s ease-in;
        }
        
        &::before, &::after {
            content: '';
            height: 100px;
            position: absolute;
            background: #FFFFFF;
            transform: rotate(-45deg);
        }
        
        .icon-line {
            height: 5px;
            background-color: #4CAF50;
            display: block;
            border-radius: 2px;
            position: absolute;
            z-index: 10;
            
            &.line-tip {
                top: 46px;
                left: 14px;
                width: 25px;
                transform: rotate(45deg);
                animation: icon-line-tip 0.75s;
            }
            
            &.line-long {
                top: 38px;
                right: 8px;
                width: 47px;
                transform: rotate(-45deg);
                animation: icon-line-long 0.75s;
            }
        }
        
        .icon-circle {
            top: -4px;
            left: -4px;
            z-index: 10;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            position: absolute;
            box-sizing: content-box;
            border: 4px solid rgba(76, 175, 80, .5);
        }
        
        .icon-fix {
            top: 8px;
            width: 5px;
            left: 26px;
            z-index: 1;
            height: 85px;
            position: absolute;
            transform: rotate(-45deg);
            background-color: #FFFFFF;
        }
    }
}

@keyframes rotate-circle {
    0% { transform: rotate(-45deg); }
    5% { transform: rotate(-45deg); }
    12% { transform: rotate(-405deg); }
    100% { transform: rotate(-405deg); }
}

@keyframes icon-line-tip {
    0% { width: 0; left: 1px; top: 19px; }
    54% { width: 0; left: 1px; top: 19px; }
    70% { width: 50px; left: -8px; top: 37px; }
    84% { width: 17px; left: 21px; top: 48px; }
    100% { width: 25px; left: 14px; top: 46px; }
}

@keyframes icon-line-long {
    0% { width: 0; right: 46px; top: 54px; }
    65% { width: 0; right: 46px; top: 54px; }
    84% { width: 55px; right: 0px; top: 35px; }
    100% { width: 47px; right: 8px; top: 38px; }
}
```

---

### FILE: `src\main\resources\static\js\app.js`

```javascript
const C = {
    API: '/api',
};

// Application State
const state = {
    user: null, // { username, role }
    products: [],
    cart: [], // { product, quantity }
    orders: []
};

// UI Handling helpers
const ui = {
    showModal: (id) => document.getElementById(id).classList.add('active'),
    closeModal: (id) => document.getElementById(id).classList.remove('active'),
    showToast: (msg) => {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },
    renderNavbar: () => {
        const navRight = document.getElementById('navRight');
        if (state.user) {
            let links = '';
            if (state.user.role === 'ADMIN') {
                links += `<div class="nav-item" onclick="app.navigate('admin')"><span class="material-icons">dashboard</span> Admin</div>`;
            } else {
                links += `<div class="nav-item" onclick="app.navigate('orders')"><span class="material-icons">inventory_2</span> Orders</div>`;
            }
            links += `
                <div class="nav-item" onclick="app.navigate('cart')">
                    <span class="material-icons">shopping_cart</span> Cart (${app.getCartTotalCount()})
                </div>
                <div class="nav-item dropdown">
                    <span class="material-icons">account_circle</span> ${state.user.username}
                </div>
                <div class="nav-item" onclick="app.logout()">
                    <span class="material-icons">logout</span>
                </div>
            `;
            navRight.innerHTML = links;
        } else {
            navRight.innerHTML = `
                <button class="btn nav-item login-btn" onclick="app.showLogin()">Login</button>
                <div class="nav-item" onclick="app.navigate('cart')">
                    <span class="material-icons">shopping_cart</span> Cart (${app.getCartTotalCount()})
                </div>
            `;
        }
    },
    renderView: (html) => {
        document.getElementById('app-content').innerHTML = html;
    }
};

// Main App Logic
const app = {
    init: async () => {
        await app.checkSession();
        app.navigate('home');

        // Setup payment method selection
        document.querySelectorAll('.pay-method').forEach(el => {
            el.addEventListener('click', function () {
                document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    },

    checkSession: async () => {
        try {
            const res = await fetch(`${C.API}/auth/me`);
            if (res.ok) {
                state.user = await res.json();
            }
        } catch (e) {
            console.error('Session check failed', e);
        }
        ui.renderNavbar();
    },

    navigate: async (view) => {
        if (view === 'home') {
            await app.fetchProducts();
            app.renderHome();
        } else if (view === 'cart') {
            app.renderCart();
        } else if (view === 'orders') {
            if (!state.user) return app.showLogin();
            await app.fetchUserOrders();
            app.renderOrders();
        } else if (view === 'admin') {
            if (!state.user || state.user.role !== 'ADMIN') return app.navigate('home');
            app.renderAdmin();
        }
    },

    fetchProducts: async () => {
        try {
            const res = await fetch(`${C.API}/products`);
            state.products = await res.json();
        } catch (e) {
            ui.showToast('Failed to load products');
        }
    },

    fetchUserOrders: async () => {
        try {
            const res = await fetch(`${C.API}/orders/my-orders`);
            state.orders = await res.json();
        } catch (e) {
            ui.showToast('Failed to load orders');
        }
    },

    addToCart: (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ product, quantity: 1 });
        }
        ui.showToast(`${product.name} added to cart!`);
        ui.renderNavbar();
    },

    updateCartItemCount: (productId, delta) => {
        const item = state.cart.find(i => i.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                state.cart = state.cart.filter(i => i.product.id !== productId);
            }
        }
        app.renderCart();
        ui.renderNavbar();
    },

    getCartTotalCount: () => {
        return state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotalPrice: () => {
        return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },

    // Rendering functions
    renderHome: () => {
        let html = '';

        if (!state.user) {
            html += `
                <div class="card mb-20 text-center" style="padding: 40px 20px; background: linear-gradient(135deg, var(--primary-color), var(--primary-hover)); color: white;">
                    <h1 style="font-size: 36px; margin-bottom: 15px;">Welcome to CampusKart! 🎓</h1>
                    <p style="font-size: 18px; margin-bottom: 25px; opacity: 0.9;">Your one-stop destination for all campus needs. Authentic products, guaranteed delivery.</p>
                    <button class="btn" style="background: white; color: var(--primary-color); font-size: 18px; padding: 12px 30px;" onclick="app.showLogin()">Login to Start Shopping</button>
                </div>
                <h2 class="mb-20" style="padding-left: 10px;">Sneak Peek at Our Catalog</h2>
            `;
        } else {
            html += `<h2 class="mb-20" style="padding-left: 10px;">Welcome back, ${state.user.username}! Here are today's top picks:</h2>`;
        }

        if (state.products.length === 0) {
            html += `<div class="empty-state"><h3>No products available at the moment.</h3></div>`;
            ui.renderView(html);
            return;
        }

        html += `<div class="product-grid">`;

        // Only show up to 3 products if NOT logged in, show all if logged in
        const displayProducts = state.user ? state.products : state.products.slice(0, 3);

        displayProducts.forEach(p => {
            html += `
                <div class="card product-card">
                    <img src="${p.imageUrl || 'https://via.placeholder.com/200'}" alt="${p.name}">
                    <div class="product-category">${p.category || 'General'}</div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
                    <button class="btn btn-primary mt-10" onclick="${state.user ? `app.addToCart(${p.id})` : `app.showLogin()`}">${state.user ? 'Add to Cart' : 'Login to Buy'}</button>
                </div>
            `;
        });
        html += `</div>`;

        if (!state.user && state.products.length > 3) {
            html += `
                <div class="text-center mt-20">
                    <p style="color: var(--text-light); margin-bottom: 15px;">Login to view thousands of more products!</p>
                </div>
            `;
        }

        ui.renderView(html);
    },

    renderCart: () => {
        if (state.cart.length === 0) {
            ui.renderView(`
                <div class="card empty-state">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-cart_ee1603.png" alt="Empty Cart">
                    <h3>Your cart is empty!</h3>
                    <p>Add items to it now.</p>
                    <button class="btn btn-primary mt-10" onclick="app.navigate('home')">Shop Now</button>
                </div>
            `);
            return;
        }

        let html = `
            <div class="card">
                <h2 class="mb-20">Shopping Cart</h2>
                <div class="flex-row">
                    <div class="flex-2">
        `;

        state.cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.product.imageUrl || 'https://via.placeholder.com/100'}" alt="${item.product.name}">
                    <div style="flex-grow:1;">
                        <h3>${item.product.name}</h3>
                        <div class="product-price mt-10">₹${item.product.price.toLocaleString('en-IN')}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="app.updateCartItemCount(${item.product.id}, -1)">-</button>
                            <span style="border:1px solid #c2c2c2; padding: 2px 15px;">${item.quantity}</span>
                            <button class="qty-btn" onclick="app.updateCartItemCount(${item.product.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        const total = app.getCartTotalPrice();
        html += `
                    </div>
                    <div class="flex-1">
                        <div class="card" style="box-shadow: 0 1px 4px 0 rgba(0,0,0,.15); position:sticky; top: 80px;">
                            <h3 style="color:var(--text-light); border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 15px;">PRICE DETAILS</h3>
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:16px;">
                                <span>Price (${app.getCartTotalCount()} items)</span>
                                <span>₹${total.toLocaleString('en-IN')}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:16px;">
                                <span>Delivery Charges</span>
                                <span style="color:var(--success-color)">FREE</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:15px; border-top: 1px dashed var(--border-color); font-size:18px; font-weight:bold;">
                                <span>Total Amount</span>
                                <span>₹${total.toLocaleString('en-IN')}</span>
                            </div>
                            <button class="btn btn-buy-now mt-20" style="width:100%; border-radius: 2px" onclick="app.startCheckout()">PLACE ORDER</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        ui.renderView(html);
    },

    renderOrders: () => {
        if (state.orders.length === 0) {
            ui.renderView(`<div class="card empty-state"><h3>You have no orders yet.</h3></div>`);
            return;
        }

        let html = `<h2>Track Your Orders</h2><div class="mt-20">`;
        state.orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();

            html += `
                <div class="card mb-20" style="display:flex; gap:20px;">
                    <div style="flex:1;">
                        <h3 style="color:var(--primary-color)">Order #${order.id}</h3>
                        <p style="color:var(--text-light); font-size:12px;">Placed on: ${date}</p>
                        <ul style="margin-top:10px; margin-left: 20px; font-size:14px; line-height:1.6">
            `;
            order.items.forEach(item => {
                html += `<li>${item.quantity}x ${item.product.name} - ₹${item.price.toLocaleString('en-IN')}</li>`;
            });
            html += `
                        </ul>
                        <div class="mt-20 font-weight-bold">Total: ₹${order.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div style="flex:1;">
                        <h4>Status Tracking</h4>
                        <div class="mt-10 mb-10" style="font-size:13px; color:var(--text-light); background:#f5faff; padding:10px; border-radius:4px; border:1px solid #e0e0e0;">
                            <b>Delivery To:</b><br>${order.deliveryAddress || 'N/A'}
                        </div>
                        <div class="order-timeline">
                            <div class="timeline-item active">
                                <b>Ordered</b><br><small>${date}</small>
                            </div>
                            <div class="timeline-item ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'active' : ''}">
                                <b>Shipped</b><br><small>${order.status === 'SHIPPED' ? 'In transit' : 'Pending'}</small>
                            </div>
                            <div class="timeline-item ${order.status === 'DELIVERED' ? 'active' : ''}">
                                <b>Delivered</b><br><small>${order.status === 'DELIVERED' ? 'Package arrived' : 'Expected soon'}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        ui.renderView(html);
    },

    renderAdmin: async () => {
        let html = `<div class="card"><h2>Admin Dashboard</h2><div class="flex-row mt-20">`;

        // Fetch All Orders
        let ordersHtml = '';
        try {
            const res = await fetch(`${C.API}/admin/orders`);
            if (res.ok) {
                const allOrders = await res.json();
                ordersHtml = `<table class="admin-table"><tr><th>ID</th><th>User</th><th>Address</th><th>Total</th><th>Status</th><th>Action</th></tr>`;
                allOrders.forEach(o => {
                    ordersHtml += `
                        <tr>
                            <td>#${o.id}</td>
                            <td>${o.user.username}</td>
                            <td style="max-width:200px; font-size:12px;">${o.deliveryAddress || 'N/A'}</td>
                            <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
                            <td>${o.status}</td>
                            <td>
                                <select onchange="app.updateOrderStatus(${o.id}, this.value)">
                                    <option value="PLACED" ${o.status === 'PLACED' ? 'selected' : ''}>PLACED</option>
                                    <option value="SHIPPED" ${o.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                                    <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                                </select>
                            </td>
                        </tr>
                    `;
                });
                ordersHtml += `</table>`;
            }
        } catch (e) { }

        html += `
            <div style="flex: 1">
                <h3>All Orders</h3>
                ${ordersHtml || '<p>No orders to manage.</p>'}
            </div>
            <div style="flex: 1">
                <h3>Add New Product</h3>
                <form id="addProductForm" onsubmit="app.handleAddProduct(event)" class="mt-20">
                    <div class="form-group"><input type="text" id="pName" required placeholder=" "><label>Product Name</label></div>
                    <div class="form-group"><input type="number" step="0.01" id="pPrice" required placeholder=" "><label>Price (₹)</label></div>
                    <div class="form-group"><input type="text" id="pCategory" placeholder=" "><label>Category</label></div>
                    <div class="form-group"><input type="text" id="pImage" placeholder=" "><label>Image URL</label></div>
                    <button class="btn btn-primary" type="submit">Publish Product</button>
                </form>
            </div>
        `;
        html += `</div></div>`;
        ui.renderView(html);
    },

    startCheckout: () => {
        if (!state.user) return app.showLogin();
        const total = app.getCartTotalPrice();
        document.getElementById('payAmount').innerText = total.toLocaleString('en-IN');

        // Reset modal state
        document.getElementById('payLoading').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'none';
        document.getElementById('qrCodeContainer').style.display = 'block';
        document.getElementById('btnPayNow').style.display = 'inline-flex';
        ui.showModal('paymentModal');
    },

    processPayment: () => {
        document.getElementById('payLoading').style.display = 'block';
        document.getElementById('qrCodeContainer').style.display = 'none';
        document.getElementById('btnPayNow').style.display = 'none';

        // Simulate a delay for the fake payment gateway
        setTimeout(() => {
            // Show Success Animation before transitioning
            document.getElementById('payLoading').style.display = 'none';
            document.getElementById('paymentSuccess').style.display = 'block';

            setTimeout(async () => {
                ui.closeModal('paymentModal');

                const addr = document.getElementById('deliveryAddress').value;

                const payload = {
                    items: state.cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
                    totalAmount: app.getCartTotalPrice(),
                    paymentStatus: 'PAID',
                    deliveryAddress: addr || 'Not provided'
                };

                try {
                    const res = await fetch(`${C.API}/orders/checkout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        state.cart = []; // Empty cart
                        app.updateCartItemCount(0, 0); // trigger redraw
                        ui.showToast('Payment Successful! Order Placed.');
                        app.navigate('orders');
                    } else {
                        ui.showToast('Checkout failed processing serverside.');
                    }
                } catch (e) {
                    ui.showToast('Network error during checkout.');
                }
            }, 2000); // 2 second success message hold
        }, 2500); // 2.5 second fake processing
    },

    updateOrderStatus: async (id, newStatus) => {
        try {
            await fetch(`${C.API}/admin/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            ui.showToast('Order status updated');
        } catch (e) {
            ui.showToast('Update failed');
        }
    },

    handleAddProduct: async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('pName').value,
            price: parseFloat(document.getElementById('pPrice').value),
            category: document.getElementById('pCategory').value,
            imageUrl: document.getElementById('pImage').value || 'https://via.placeholder.com/200'
        };

        try {
            const res = await fetch(`${C.API}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                ui.showToast('Product Added!');
                e.target.reset();
            } else {
                ui.showToast('Failed to add product');
            }
        } catch (err) {
            ui.showToast('Network Error');
        }
    },

    // Auth flows
    showLogin: () => {
        ui.closeModal('registerModal');
        ui.showModal('authModal');
    },
    showRegister: () => {
        ui.closeModal('authModal');
        ui.showModal('registerModal');
    },

    handleLogin: async (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value;
        const p = document.getElementById('loginPassword').value;

        try {
            const res = await fetch(`${C.API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            if (res.ok) {
                ui.closeModal('authModal');
                ui.showToast('Logged in successfully');
                await app.checkSession();
                app.navigate('home');
            } else {
                document.getElementById('loginError').innerText = 'Invalid username or password';
            }
        } catch (e) {
            document.getElementById('loginError').innerText = 'Network error. Try again.';
        }
    },

    handleRegister: async (e) => {
        e.preventDefault();
        const u = document.getElementById('regUsername').value;
        const p = document.getElementById('regPassword').value;

        try {
            const res = await fetch(`${C.API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            if (res.ok) {
                ui.closeModal('registerModal');
                ui.showToast('Registration successful! Please login.');
                app.showLogin();
            } else {
                const text = await res.text();
                document.getElementById('regError').innerText = text || 'Registration failed';
            }
        } catch (e) {
            document.getElementById('regError').innerText = 'Network error. Try again.';
        }
    },

    logout: async () => {
        try {
            await fetch(`${C.API}/auth/logout`, { method: 'POST' });
        } catch (e) { }
        state.user = null;
        state.cart = [];
        ui.showToast('Logged out');
        ui.renderNavbar();
        app.navigate('home');
    }
};

window.onload = app.init;
```

---


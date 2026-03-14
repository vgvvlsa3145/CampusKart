package com.campuskart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusKartApplication {
    public static void main(String[] args) {
        // Automatically fix the database URL if it's from a cloud provider (starts with postgres://)
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && dbUrl.startsWith("postgres") && !dbUrl.startsWith("jdbc:postgres")) {
            System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
        }
        
        SpringApplication.run(CampusKartApplication.class, args);
    }
}

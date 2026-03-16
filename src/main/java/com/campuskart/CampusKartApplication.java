package com.campuskart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusKartApplication {
    public static void main(String[] args) {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
            try {
                // cloud URLs come as postgres://user:password@host:port/db
                java.net.URI uri = new java.net.URI(dbUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":");
                    System.setProperty("spring.datasource.username", parts[0]);
                    System.setProperty("spring.datasource.password", parts[1]);
                }
                
                int port = uri.getPort();
                if (port == -1) port = 5432;
                
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath();
                String query = uri.getQuery();
                
                if (query != null && !query.isEmpty()) {
                    jdbcUrl += "?" + query;
                    if (!query.contains("sslmode=")) {
                        jdbcUrl += "&sslmode=require";
                    }
                } else {
                    jdbcUrl += "?sslmode=require";
                }
                
                System.setProperty("spring.datasource.url", jdbcUrl);
                System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
                System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
                
            } catch (Exception e) {
                // Fail-safe: if manual parsing fails, try simple prefixing
                if (!dbUrl.startsWith("jdbc:")) {
                    System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
                }
            }
        }
        
        SpringApplication.run(CampusKartApplication.class, args);
    }
}

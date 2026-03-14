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

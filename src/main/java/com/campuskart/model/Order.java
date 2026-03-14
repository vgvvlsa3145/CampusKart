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

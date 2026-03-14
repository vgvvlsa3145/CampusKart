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

package com.campuskart.repository;

import com.campuskart.model.Order;
import com.campuskart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findAllByOrderByCreatedAtDesc();
}

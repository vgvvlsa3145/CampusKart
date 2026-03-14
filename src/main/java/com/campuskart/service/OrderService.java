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

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

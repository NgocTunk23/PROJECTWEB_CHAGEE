package com.example.chagee.dto;

import java.util.List;

public class OrderRequest {
    
    // --- Các biến (Fields) ---
    private Long user_id;
    private Double total_price;
    private String address;
    private String phone;
    private List<OrderItemRequest> items;

    // --- Constructor mặc định (Bắt buộc để Spring đọc JSON) ---
    public OrderRequest() {
    }

    // --- Getter và Setter thủ công (Thay thế cho @Data) ---

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(Double total_price) {
        this.total_price = total_price;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    // ==========================================
    // Class con bên trong (Inner Class) cho từng món hàng
    // ==========================================
    public static class OrderItemRequest {
        private Long product_id;
        private Integer quantity;
        private Double price;
        private String note; // Ghi chú (đường, đá...)

        public OrderItemRequest() {
        }

        // Getter và Setter cho class con

        public Long getProduct_id() {
            return product_id;
        }

        public void setProduct_id(Long product_id) {
            this.product_id = product_id;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }
    }
}
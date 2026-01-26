package com.example.chagee.entity; // ✅ SỬA THÀNH entity

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;
    private Double total_price;
    private String address;
    private String phone;
    private Date created_at;

    // Liên kết: 1 Order có nhiều OrderDetail
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    public Order() {
        this.created_at = new Date();
    }

    // --- Getter & Setter của Order ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Double getTotal_price() { return total_price; }
    public void setTotalPrice(Double total_price) { this.total_price = total_price; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Date getCreatedAt() { return created_at; }
    public void setCreatedAt(Date created_at) { this.created_at = created_at; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }

    // ========================================================
    // CLASS CON: ORDER DETAIL (Nằm gọn trong file này luôn)
    // ========================================================
    @Entity
    @Table(name = "order_details")
    public static class OrderDetail {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // Liên kết ngược về Order cha
        @ManyToOne
        @JoinColumn(name = "order_id")
        private Order order;

        private Long product_id;
        private Integer quantity;
        private Double price;
        private String note;

        public OrderDetail() {}

        // --- Getter & Setter của OrderDetail ---
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Order getOrder() { return order; }
        public void setOrder(Order order) { this.order = order; }

        public Long getProductId() { return product_id; }
        public void setProductId(Long product_id) { this.product_id = product_id; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }

        
    }
}
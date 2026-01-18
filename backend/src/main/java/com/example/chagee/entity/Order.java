package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "Orders")
public class Order {

    // ========================================================================
    // 1. CLASS: OrderDetail (Lớp con nằm bên trong Order)
    // ========================================================================
    @Entity
    @Table(name = "OrderDetails")
    public static class OrderDetail {

        // --- 1.1. CLASS: OrderDetailId (Khóa chính nằm bên trong OrderDetail) ---
        @Embeddable
        public static class Id implements Serializable {
            private String orderId;
            private String productId;

            public Id() {}
            public Id(String orderId, String productId) {
                this.orderId = orderId;
                this.productId = productId;
            }

            // Getters/Setters ID
            public String getOrderId() { return orderId; }
            public void setOrderId(String orderId) { this.orderId = orderId; }
            public String getProductId() { return productId; }
            public void setProductId(String productId) { this.productId = productId; }

            @Override
            public boolean equals(Object o) {
                if (this == o) return true;
                if (o == null || getClass() != o.getClass()) return false;
                Id id = (Id) o;
                return Objects.equals(orderId, id.orderId) &&
                        Objects.equals(productId, id.productId);
            }
            @Override
            public int hashCode() {
                return Objects.hash(orderId, productId);
            }
        }

        // --- 1.2. Thuộc tính của OrderDetail ---
        @EmbeddedId
        private Id id = new Id();

        @ManyToOne
        @MapsId("orderId") 
        @JoinColumn(name = "order_id")
        private Order order;

        @ManyToOne
        @MapsId("productId") 
        @JoinColumn(name = "product_id")
        private Product product;

        @Column(name = "quantity")
        private Integer quantity;

        public OrderDetail() {}

        public OrderDetail(Order order, Product product, Integer quantity) {
            this.order = order;
            this.product = product;
            this.quantity = quantity;
            this.id = new Id(order.getOrderId(), product.getProductId());
        }

        // Getters/Setters OrderDetail
        public Id getId() { return id; }
        public void setId(Id id) { this.id = id; }
        public Order getOrder() { return order; }
        public void setOrder(Order order) { this.order = order; }
        public Product getProduct() { return product; }
        public void setProduct(Product product) { this.product = product; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    // ========================================================================
    // 2. MAIN CLASS: Order (Lớp chính)
    // ========================================================================
    
    @Id
    @Column(name = "order_id", length = 50)
    private String orderId;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "tax_price")
    private BigDecimal taxPrice;

    @Column(name = "statusU")
    private String status;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "completion_time")
    private LocalDateTime completionTime;

    // --- Quan hệ ---

    @ManyToOne
    @JoinColumn(name = "buyer_username")
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    // List chứa các chi tiết đơn hàng (Link tới static class bên trên)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    // --- Constructor ---
    public Order() {}

    @PrePersist
    protected void onCreate() {
        if (this.orderTime == null) this.orderTime = LocalDateTime.now();
        if (this.status == null) this.status = "Pending";
        if (this.taxPrice == null) this.taxPrice = BigDecimal.ZERO;
    }

    // --- Helper để thêm sản phẩm vào đơn hàng dễ dàng ---
    public void addProduct(Product product, Integer quantity) {
        OrderDetail detail = new OrderDetail(this, product, quantity);
        orderDetails.add(detail);
    }

    // --- Getters và Setters của Order ---
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getTaxPrice() { return taxPrice; }
    public void setTaxPrice(BigDecimal taxPrice) { this.taxPrice = taxPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    public LocalDateTime getCompletionTime() { return completionTime; }
    public void setCompletionTime(LocalDateTime completionTime) { this.completionTime = completionTime; }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) { this.buyer = buyer; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }
}
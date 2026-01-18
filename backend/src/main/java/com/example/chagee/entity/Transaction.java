package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Transactions")
public class Transaction {

    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP - 3 CỘT)
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        
        @Column(name = "transaction_id", length = 50)
        private String transactionId; // Mã giao dịch (VD: TXN001)

        @Column(name = "order_id", length = 50)
        private String orderId;

        @Column(name = "buyer_username", length = 50)
        private String buyerUsername;

        // --- Constructors ---
        public Id() {}

        public Id(String transactionId, String orderId, String buyerUsername) {
            this.transactionId = transactionId;
            this.orderId = orderId;
            this.buyerUsername = buyerUsername;
        }

        // --- Getters & Setters (Bắt buộc) ---
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getBuyerUsername() { return buyerUsername; }
        public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

        // --- Equals & HashCode (Bắt buộc cho Composite Key) ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(transactionId, id.transactionId) &&
                   Objects.equals(orderId, id.orderId) &&
                   Objects.equals(buyerUsername, id.buyerUsername);
        }

        @Override
        public int hashCode() {
            return Objects.hash(transactionId, orderId, buyerUsername);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH ENTITY
    // ========================================================================

    @EmbeddedId
    private Id id = new Id(); // Khởi tạo sẵn để tránh NullPointerException

    // Liên kết Foreign Key tới Order
    @ManyToOne
    @MapsId("orderId") 
    @JoinColumn(name = "order_id")
    private Order order;

    // Liên kết Foreign Key tới Buyer
    @ManyToOne
    @MapsId("buyerUsername")
    @JoinColumn(name = "buyer_username")
    private Buyer buyer;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "transaction_time")
    private LocalDateTime transactionTime;

    @Column(name = "payment_gateway")
    private String paymentGateway;

    @Column(name = "bank_name")
    private String bankName;

    // ========================================================================
    // 3. CONSTRUCTORS & LIFECYCLE
    // ========================================================================

    public Transaction() {}

    // Constructor tiện lợi để tạo nhanh giao dịch
    public Transaction(String transactionCode, Order order, Buyer buyer, BigDecimal amount, String gateway, String bankName) {
        this.order = order;
        this.buyer = buyer;
        this.amount = amount;
        this.paymentGateway = gateway;
        this.bankName = bankName;
        // Tự động set ID
        this.id = new Id(transactionCode, order.getOrderId(), buyer.getUsername());
    }

    @PrePersist
    protected void onCreate() {
        if (this.transactionTime == null) {
            this.transactionTime = LocalDateTime.now();
        }
    }

    // ========================================================================
    // 4. GETTERS & SETTERS (FULL)
    // ========================================================================

    public Id getId() { return id; }
    public void setId(Id id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) {
        this.order = order;
        // Sync ID
        if (order != null) {
            this.id.setOrderId(order.getOrderId());
        }
    }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        // Sync ID
        if (buyer != null) {
            this.id.setBuyerUsername(buyer.getUsername());
        }
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getTransactionTime() { return transactionTime; }
    public void setTransactionTime(LocalDateTime transactionTime) { this.transactionTime = transactionTime; }

    public String getPaymentGateway() { return paymentGateway; }
    public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    
    // Helper để set Transaction ID (mã giao dịch VNPay/Momo trả về)
    public void setTransactionCode(String code) {
        this.id.setTransactionId(code);
    }
    
    public String getTransactionCode() {
        return this.id.getTransactionId();
    }
}
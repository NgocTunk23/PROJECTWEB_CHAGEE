package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "Transactions") // Khớp: Transactions
public class Transaction {

    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        
        @Column(name = "transactionid", length = 255) // Khớp: transactionid VARCHAR(255)
        private String transactionid; 

        @Column(name = "orderid", length = 255) // Khớp: orderid VARCHAR(255)
        private String orderid; 

        @Column(name = "buyerusername", length = 255) // Khớp: buyerusername VARCHAR(255)
        private String buyerusername;

        public Id() {}

        public Id(String transactionid, String orderid, String buyerusername) {
            this.transactionid = transactionid;
            this.orderid = orderid;
            this.buyerusername = buyerusername;
        }

        // --- Getters & Setters (Viết liền) ---
        public String getTransactionid() { return transactionid; }
        public void setTransactionid(String transactionid) { this.transactionid = transactionid; }

        public String getOrderid() { return orderid; }
        public void setOrderid(String orderid) { this.orderid = orderid; }

        public String getBuyerusername() { return buyerusername; }
        public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(transactionid, id.transactionid) &&
                   Objects.equals(orderid, id.orderid) &&
                   Objects.equals(buyerusername, id.buyerusername);
        }

        @Override
        public int hashCode() {
            return Objects.hash(transactionid, orderid, buyerusername);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH ENTITY
    // ========================================================================
    @EmbeddedId
    private Id id = new Id(); 

    @ManyToOne
    @MapsId("orderid") 
    @JoinColumn(name = "orderid")
    private Order order;

    @ManyToOne
    @MapsId("buyerusername")
    @JoinColumn(name = "buyerusername")
    private Buyer buyer;

    @Column(name = "amount") // Khớp: amount DECIMAL(18, 2)
    private BigDecimal amount;

    @Column(name = "transactiontime") // Khớp: transactiontime DATETIME
    @Temporal(TemporalType.TIMESTAMP)
    private Date transactiontime;

    @Column(name = "paymentgateway", columnDefinition = "NVARCHAR(255)") // Khớp: paymentgateway NVARCHAR(255)
    private String paymentgateway;

    @Column(name = "bankname", columnDefinition = "NVARCHAR(255)") // Khớp: bankname NVARCHAR(255)
    private String bankname;

    public Transaction() {
        this.transactiontime = new Date();
    }

    public Transaction(String transactionid, Order order, Buyer buyer, BigDecimal amount, String paymentgateway, String bankname) {
        this.order = order;
        this.buyer = buyer;
        this.amount = amount;
        this.paymentgateway = paymentgateway;
        this.bankname = bankname;
        this.transactiontime = new Date();
        // Khởi tạo ID phức hợp
        this.id = new Id(transactionid, order.getOrderid(), buyer.getUsername());
    }

    @PrePersist
    protected void onCreate() {
        if (this.transactiontime == null) this.transactiontime = new Date();
    }

    // --- Getters & Setters ---
    public Id getId() { return id; }
    public void setId(Id id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) {
        this.order = order;
        if (order != null) this.id.setOrderid(order.getOrderid());
    }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        if (buyer != null) this.id.setBuyerusername(buyer.getUsername());
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Date getTransactiontime() { return transactiontime; }
    public void setTransactiontime(Date transactiontime) { this.transactiontime = transactiontime; }

    public String getPaymentgateway() { return paymentgateway; }
    public void setPaymentgateway(String paymentgateway) { this.paymentgateway = paymentgateway; }

    public String getBankname() { return bankname; }
    public void setBankname(String bankname) { this.bankname = bankname; }
}
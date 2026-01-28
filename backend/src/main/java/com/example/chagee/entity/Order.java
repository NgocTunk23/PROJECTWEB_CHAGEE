package com.example.chagee.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal; // ✅ Nhớ import BigDecimal
@Entity
@Table(name = "Orders")
public class Order {

    // ========================================================================
    // 1. THÔNG TIN ĐƠN HÀNG (Dùng tên viết liền theo SQL)
    // ========================================================================
    
    @Id
    @Column(name = "orderid", length = 255) // Khớp: orderid VARCHAR(255)
    private String orderid; 

    @Column(name = "buyerusername") // Khớp: buyerusername VARCHAR(255)
    private String buyerusername;

    @Column(name = "originalprice") // Khớp: originalprice DECIMAL(18, 2)
    private BigDecimal originalprice;

    @Column(name = "taxprice") // Khớp: taxprice DECIMAL(18, 2)
    private BigDecimal taxprice = BigDecimal.ZERO;

    @Column(name = "statusU") // Khớp: statusU NVARCHAR(255)
    private String statusU = "Pending";

    @Column(name = "paymentmethod") // Khớp: paymentmethod NVARCHAR(255)
    private String paymentmethod;

    @Column(name = "ordertime") // Khớp: ordertime DATETIME
    @Temporal(TemporalType.TIMESTAMP)
    private Date ordertime;

    @Column(name = "branchid") // Khớp: branchid VARCHAR(255)
    private String branchid;

    // ========================================================================
    // 2. QUAN HỆ VỚI CHI TIẾT ĐƠN HÀNG
    // ========================================================================
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    public Order() {
        this.ordertime = new Date();
        if (this.orderid == null) {
            this.orderid = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    // ========================================================================
    // 3. GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================
    public String getOrderid() { return orderid; }
    public void setOrderid(String orderid) { this.orderid = orderid; }

    public String getBuyerusername() { return buyerusername; }
    public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

    public BigDecimal getOriginalprice() { return originalprice; }
    public void setOriginalprice(BigDecimal originalprice) { this.originalprice = originalprice; }

    public BigDecimal getTaxprice() { return taxprice; }
    public void setTaxprice(BigDecimal taxprice) { this.taxprice = taxprice; }

    public String getStatusU() { return statusU; }
    public void setStatusU(String statusU) { this.statusU = statusU; }

    public String getPaymentmethod() { return paymentmethod; }
    public void setPaymentmethod(String paymentmethod) { this.paymentmethod = paymentmethod; }

    public Date getOrdertime() { return ordertime; }
    public void setOrdertime(Date ordertime) { this.ordertime = ordertime; }

    public String getBranchid() { return branchid; }
    public void setBranchid(String branchid) { this.branchid = branchid; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }

    // ========================================================================
    // 4. CLASS CON: ORDER DETAIL (Dùng tên viết liền theo SQL)
    // ========================================================================
    @Entity
    @Table(name = "OrderDetails")
    public static class OrderDetail {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id") // Khớp: id BIGINT IDENTITY
        private Long id;

        @ManyToOne
        @JoinColumn(name = "orderid") // Khớp: orderid VARCHAR(255)
        private Order order;

        @Column(name = "productid") // Khớp: productid VARCHAR(255)
        private String productid;
        
        @Column(name = "quantity") // Khớp: quantity INT
        private Integer quantity;

        @Column(name = "price") // Khớp: price DECIMAL
        private BigDecimal price;

        @Column(name = "note") // Khớp: note NVARCHAR
        private String note;

        public OrderDetail() {}

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Order getOrder() { return order; }
        public void setOrder(Order order) { this.order = order; }
        public String getProductid() { return productid; }
        public void setProductid(String productid) { this.productid = productid; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }
}
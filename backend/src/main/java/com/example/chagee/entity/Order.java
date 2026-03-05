package com.example.chagee.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.math.BigDecimal;

@Entity
@Table(name = "Orders")
public class Order {

    @Id
    @Column(name = "orderid", length = 255)
    private String orderid; 

    @Column(name = "buyerusername")
    private String buyerusername;

    @Column(name = "phonenumber") 
    private String phonenumber;

    @Column(name = "addressU", columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(name = "vouchercode")
    private String vouchercode;

    @Column(name = "originalprice")
    private BigDecimal originalprice;

    @Column(name = "taxprice")
    private BigDecimal taxprice = BigDecimal.ZERO;

    @Column(name = "statusU", columnDefinition = "NVARCHAR(255)")
    private String statusU = "Pending";

    @Column(name = "paymentmethod", columnDefinition = "NVARCHAR(255)")
    private String paymentmethod;

    @Column(name = "ordertime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date ordertime;

    @Column(name = "branchid")
    private String branchid;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderDetail> orderDetails = new ArrayList<>();


    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    public Order() {
        this.ordertime = new Date();
        if (this.orderid == null) {
            this.orderid = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    // Getters & Setters
    public String getOrderid() { return orderid; }
    public void setOrderid(String orderid) { this.orderid = orderid; }
    public String getBuyerusername() { return buyerusername; }
    public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }
    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getVouchercode() { return vouchercode; }
    public void setVouchercode(String vouchercode) { this.vouchercode = vouchercode; }
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

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    // ========================================================================
    // CLASS CON: ORDER DETAIL (ĐÃ FIX ĐỂ LẤY TÊN SẢN PHẨM)
    // ========================================================================
    @Entity
    @Table(name = "OrderDetails")
    public static class OrderDetail {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "orderid")
        @JsonBackReference
        private Order order;

        // ✅ CHỖ NÀY QUAN TRỌNG: Liên kết với bảng Products
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "productid", insertable = false, updatable = false)
        @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Thêm dòng này cho chắc
        private Product product;




        @Column(name = "productid")
        private String productid;
        
        @Column(name = "quantity")
        private Integer quantity;

        @Column(name = "price")
        private BigDecimal price;




        @Column(name = "sizelevel", length = 50)
        private String sizelevel;

        @Column(name = "sugarlevel", length = 50)
        private String sugarlevel;

        @Column(name = "icelevel", length = 50)
        private String icelevel;

        public OrderDetail() {}

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Order getOrder() { return order; }
        public void setOrder(Order order) { this.order = order; }
        
        // Getter cho Product để React lấy được name/image
        public Product getProduct() { return product; }
        public void setProduct(Product product) { this.product = product; }

        public String getProductid() { return productid; }
        public void setProductid(String productid) { this.productid = productid; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public String getSizelevel() { return sizelevel; }
        public void setSizelevel(String sizelevel) { this.sizelevel = sizelevel; }
        public String getSugarlevel() { return sugarlevel; }
        public void setSugarlevel(String sugarlevel) { this.sugarlevel = sugarlevel;}
        public String getIcelevel() { return icelevel; }
        public void setIcelevel(String icelevel) { this.icelevel = icelevel;}
    }
}
package com.example.chagee.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Products") // Khớp: Products
public class Product {

    @Id
    @Column(name = "productid", length = 255) // Khớp: productid VARCHAR(255)
    private String productid;

    @Column(name = "productname", nullable = false) // Khớp: productname NVARCHAR(100)
    private String productname;

    @Column(name = "productimage") // Khớp: productimage VARCHAR(MAX)
    private String productimage;

    @Column(name = "displayprice", nullable = false) // Khớp: displayprice DECIMAL(18, 2)
    private BigDecimal displayprice;

    @Column(name = "category") // Khớp: category NVARCHAR(255)
    private String category;

    @Column(name = "descriptionU") // Khớp: descriptionU NVARCHAR(MAX)
    private String description;

    @Column(name = "soldquantity") // Khớp: soldquantity INT
    private Integer soldquantity;

    // Mapping tới bảng Admin (người duyệt)
    @ManyToOne
    @JoinColumn(name = "approvedby") // Khớp: approvedby VARCHAR(255)
    private Admin approvedby;

    public Product() {
        this.soldquantity = 0; // Mặc định 0
    }

    // ========================================================================
    // GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================
    public String getProductid() { return productid; }
    public void setProductid(String productid) { this.productid = productid; }

    public String getProductname() { return productname; }
    public void setProductname(String productname) { this.productname = productname; }

    public String getProductimage() { return productimage; }
    public void setProductimage(String productimage) { this.productimage = productimage; }

    public BigDecimal getDisplayprice() { return displayprice; }
    public void setDisplayprice(BigDecimal displayprice) { this.displayprice = displayprice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescriptionU() { return description; }
    public void setDescriptionU(String description) { this.description = description; }

    public Integer getSoldquantity() { return soldquantity; }
    public void setSoldquantity(Integer soldquantity) { this.soldquantity = soldquantity; }

    public Admin getApprovedby() { return approvedby; }
    public void setApprovedby(Admin approvedby) { this.approvedby = approvedby; }
}
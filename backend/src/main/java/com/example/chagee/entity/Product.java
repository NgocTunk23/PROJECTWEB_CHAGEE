package com.example.chagee.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Products")
public class Product {
    @Id
    @Column(name = "product_id", length = 50)
    private String productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "display_price", nullable = false)
    private BigDecimal displayPrice;

    private String category;

    @Column(name = "descriptionU")
    private String description;

    @Column(name = "sold_quantity")
    private Integer soldQuantity;

    // Mapping tới bảng Admin (người duyệt)
    @ManyToOne
    @JoinColumn(name = "approved_by") 
    private Admin approvedBy;

    public Product() {}

    // Getters và Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public BigDecimal getDisplayPrice() { return displayPrice; }
    public void setDisplayPrice(BigDecimal displayPrice) { this.displayPrice = displayPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Admin getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Admin approvedBy) { this.approvedBy = approvedBy; }

    public Integer getSoldQuantity() { return soldQuantity; }
}
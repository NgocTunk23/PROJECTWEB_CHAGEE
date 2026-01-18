package com.example.chagee.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Vouchers")
public class Voucher {
    @Id
    @Column(name = "voucher_code", length = 50)
    private String voucherCode;

    @Column(name = "voucher_name", length = 100)
    private String voucherName;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @Column(name = "max_discount")
    private BigDecimal maxDiscount;

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private Admin createdBy;

    // Constructors
    public Voucher() {}

    // Getters & Setters
    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
    public String getVoucherName() { return voucherName; }
    public void setVoucherName(String voucherName) { this.voucherName = voucherName; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }
    public BigDecimal getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(BigDecimal maxDiscount) { this.maxDiscount = maxDiscount; }
    public BigDecimal getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; }
    public Admin getCreatedBy() { return createdBy; }
    public void setCreatedBy(Admin createdBy) { this.createdBy = createdBy; }
}
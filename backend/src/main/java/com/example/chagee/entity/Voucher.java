package com.example.chagee.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Vouchers") // Khớp: Vouchers
public class Voucher {

    @Id
    @Column(name = "vouchercode", length = 255) // Khớp: vouchercode VARCHAR(255)
    private String vouchercode;

    @Column(name = "vouchername", length = 100) // Khớp: vouchername NVARCHAR(100)
    private String vouchername;

    @Column(name = "discountamount") // Khớp: discountamount DECIMAL(18, 2)
    private BigDecimal discountamount;

    @Column(name = "discountpercentage") // Khớp: discountpercentage INT
    private Integer discountpercentage;

    @Column(name = "maxdiscount") // Khớp: maxdiscount DECIMAL(18, 2)
    private BigDecimal maxdiscount;

    @Column(name = "minordervalue") // Khớp: minordervalue DECIMAL(18, 2)
    private BigDecimal minordervalue;

    @ManyToOne
    @JoinColumn(name = "createdby") // Khớp: createdby VARCHAR(255) trỏ tới Admins
    private Admin createdby;

    public Voucher() {}

    // ========================================================================
    // GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================
    public String getVouchercode() { return vouchercode; }
    public void setVouchercode(String vouchercode) { this.vouchercode = vouchercode; }

    public String getVouchername() { return vouchername; }
    public void setVouchername(String vouchername) { this.vouchername = vouchername; }

    public BigDecimal getDiscountamount() { return discountamount; }
    public void setDiscountamount(BigDecimal discountamount) { this.discountamount = discountamount; }

    public Integer getDiscountpercentage() { return discountpercentage; }
    public void setDiscountpercentage(Integer discountpercentage) { this.discountpercentage = discountpercentage; }

    public BigDecimal getMaxdiscount() { return maxdiscount; }
    public void setMaxdiscount(BigDecimal maxdiscount) { this.maxdiscount = maxdiscount; }

    public BigDecimal getMinordervalue() { return minordervalue; }
    public void setMinordervalue(BigDecimal minordervalue) { this.minordervalue = minordervalue; }

    public Admin getCreatedby() { return createdby; }
    public void setCreatedby(Admin createdby) { this.createdby = createdby; }
}
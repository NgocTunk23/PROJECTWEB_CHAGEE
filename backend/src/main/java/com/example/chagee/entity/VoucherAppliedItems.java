package com.example.chagee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "VoucherAppliedItems")
public class VoucherAppliedItems {

    // Nhúng khóa chính phức hợp vào đây
    @EmbeddedId
    private VoucherAppliedItemsId id;

    public VoucherAppliedItems() {}

    public VoucherAppliedItems(String vouchercode, String applicableobject) {
        this.id = new VoucherAppliedItemsId(vouchercode, applicableobject);
    }

    // --- Getters & Setters ---
    public VoucherAppliedItemsId getId() {
        return id;
    }

    public void setId(VoucherAppliedItemsId id) {
        this.id = id;
    }
    
    // Tiện ích: Helper methods để lấy dữ liệu nhanh mà không cần gọi .getId()
    @Transient // Không map vào DB, chỉ dùng trong code Java cho tiện
    public String getVoucherCode() {
        return id != null ? id.getVouchercode() : null;
    }

    @Transient
    public String getApplicableObject() {
        return id != null ? id.getApplicableobject() : null;
    }
}
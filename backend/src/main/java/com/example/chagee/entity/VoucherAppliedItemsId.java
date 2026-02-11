package com.example.chagee.entity;

import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class VoucherAppliedItemsId implements Serializable {

    @Column(name = "vouchercode")
    private String vouchercode;

    // 👇 Quan trọng: Định nghĩa NVARCHAR để lưu tiếng Việt (VD: "Trà sữa")
    @Column(name = "applicableobject", columnDefinition = "NVARCHAR(100)") 
    private String applicableobject;

    public VoucherAppliedItemsId() {}

    public VoucherAppliedItemsId(String vouchercode, String applicableobject) {
        this.vouchercode = vouchercode;
        this.applicableobject = applicableobject;
    }

    // --- Getters & Setters ---
    public String getVouchercode() { return vouchercode; }
    public void setVouchercode(String vouchercode) { this.vouchercode = vouchercode; }

    public String getApplicableobject() { return applicableobject; }
    public void setApplicableobject(String applicableobject) { this.applicableobject = applicableobject; }

    // --- Bắt buộc phải có equals() và hashCode() cho Composite Key ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VoucherAppliedItemsId that = (VoucherAppliedItemsId) o;
        return Objects.equals(vouchercode, that.vouchercode) &&
               Objects.equals(applicableobject, that.applicableobject);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vouchercode, applicableobject);
    }
}
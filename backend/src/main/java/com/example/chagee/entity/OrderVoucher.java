package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * Entity lưu vết việc sử dụng Voucher cho từng Đơn hàng
 * Giúp quản lý logic: Một người dùng mã thì "xóa" đối với họ nhưng người khác vẫn dùng được
 */
@Entity
@Table(name = "OrderVouchers")
@IdClass(OrderVoucher.OrderVoucherId.class) // Khai báo lớp khóa chính phức hợp
public class OrderVoucher {

    @Id
    @Column(name = "orderid", length = 255)
    private String orderid;

    @Id
    @Column(name = "vouchercode", length = 255)
    private String vouchercode;

    public OrderVoucher() {
    }

    public OrderVoucher(String orderid, String vouchercode) {
        this.orderid = orderid;
        this.vouchercode = vouchercode;
    }

    // ========================================================================
    // GETTERS & SETTERS
    // ========================================================================
    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getVouchercode() {
        return vouchercode;
    }

    public void setVouchercode(String vouchercode) {
        this.vouchercode = vouchercode;
    }

    // ========================================================================
    // INNER CLASS: Xử lý khóa chính phức hợp (orderid + vouchercode)
    // ========================================================================
    public static class OrderVoucherId implements Serializable {
        private String orderid;
        private String vouchercode;

        public OrderVoucherId() {
        }

        public OrderVoucherId(String orderid, String vouchercode) {
            this.orderid = orderid;
            this.vouchercode = vouchercode;
        }

        // Bắt buộc phải override equals và hashCode để JPA quản lý được khóa phức hợp
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            OrderVoucherId that = (OrderVoucherId) o;
            return Objects.equals(orderid, that.orderid) && 
                   Objects.equals(vouchercode, that.vouchercode);
        }

        @Override
        public int hashCode() {
            return Objects.hash(orderid, vouchercode);
        }

        // Getters/Setters cho Id class
        public String getOrderid() { return orderid; }
        public void setOrderid(String orderid) { this.orderid = orderid; }
        public String getVouchercode() { return vouchercode; }
        public void setVouchercode(String vouchercode) { this.vouchercode = vouchercode; }
    }
}
package com.example.chagee.dto;

import java.util.List;
import java.math.BigDecimal;

public class OrderRequest {
    
    private String buyerusername;  // Tên đăng nhập người mua
    private BigDecimal originalprice; // Tổng tiền cuối cùng
    private String paymentmethod;   // Phương thức thanh toán (COD, VNPay...)
    private String branchid;        // ID chi nhánh
    private String phonenumber;     // Số điện thoại nhận hàng
    private String address;         // Địa chỉ cửa hàng/nhận hàng
    private String vouchercode;     // Mã giảm giá đã áp dụng
    private List<OrderItemRequest> items; // Danh sách món ăn

    public OrderRequest() {
    }

    // ==========================================
    // GETTERS & SETTERS (Đồng bộ với Controller)
    // ==========================================
    public String getBuyerusername() { return buyerusername; }
    public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

    public BigDecimal getOriginalprice() { return originalprice; }
    public void setOriginalprice(BigDecimal originalprice) { this.originalprice = originalprice; }

    public String getPaymentmethod() { return paymentmethod; }
    public void setPaymentmethod(String paymentmethod) { this.paymentmethod = paymentmethod; }

    public String getBranchid() { return branchid; }
    public void setBranchid(String branchid) { this.branchid = branchid; }

    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getVouchercode() { return vouchercode; }
    public void setVouchercode(String vouchercode) { this.vouchercode = vouchercode; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    // ==========================================
    // Inner Class: OrderItemRequest
    // ==========================================
    public static class OrderItemRequest {
        
        private String productid; 
        private Integer quantity;
        private BigDecimal price;
        private String note; // Lưu thông tin Size, Đường, Đá

        public OrderItemRequest() {
        }

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
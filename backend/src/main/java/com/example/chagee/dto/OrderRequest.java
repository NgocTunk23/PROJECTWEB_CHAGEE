package com.example.chagee.dto;

import java.util.List;
import java.math.BigDecimal;
public class OrderRequest {
    
    private String buyerusername; // Thay cho user_id
    private BigDecimal originalprice; // Thay cho total_price
    private String paymentmethod; // Thêm để khớp SQL
    private String branchid;      // Thêm để khớp SQL
    private List<OrderItemRequest> items;

    // ⚠️ ĐÃ BỎ: address, phone (Vì Database không có cột này trong bảng Orders)

    public OrderRequest() {
    }

    // ==========================================
    // GETTERS & SETTERS (Viết liền theo SQL)
    // ==========================================
    public String getBuyerusername() { return buyerusername; }
    public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

    public BigDecimal getOriginalprice() { return originalprice; }
    public void setOriginalprice(BigDecimal originalprice) { this.originalprice = originalprice; }

    public String getPaymentmethod() { return paymentmethod; }
    public void setPaymentmethod(String paymentmethod) { this.paymentmethod = paymentmethod; }

    public String getBranchid() { return branchid; }
    public void setBranchid(String branchid) { this.branchid = branchid; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    // ==========================================
    // Inner Class: OrderItemRequest
    // ==========================================
    public static class OrderItemRequest {
        
        private String productid; // Thay cho product_id
        private Integer quantity;
        private BigDecimal price;
        private String note; 

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
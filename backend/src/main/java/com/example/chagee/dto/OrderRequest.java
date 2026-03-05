package com.example.chagee.dto;

import java.util.List;
import java.math.BigDecimal;

public class OrderRequest {
    
    private String buyerusername;
    private BigDecimal originalprice;
    private String paymentmethod;
    private String branchid;
    private String phonenumber;
    private String address;
    private String vouchercode;
    
    // ✅ THÊM: Ghi chú tổng của đơn hàng (Khớp với getNote() ở Controller)
    private String note; 

    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    // --- Getters & Setters cho OrderRequest ---
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

    public String getNote() { return note; } // ✅ Fix lỗi Undefined getNote()
    public void setNote(String note) { this.note = note; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    // ==========================================
    // Inner Class: OrderItemRequest
    // ==========================================
    public static class OrderItemRequest {
        
        private String productid; 
        private Integer quantity;
        private BigDecimal price;
        
        // ✅ THÊM 3 TRƯỜNG MỚI: Tách riêng thay vì để trong note
        private String sizelevel;
        private String sugarlevel;
        private String icelevel;

        public OrderItemRequest() {
        }

        // --- Getters & Setters cho OrderItemRequest ---
        public String getProductid() { return productid; }
        public void setProductid(String productid) { this.productid = productid; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public String getSizelevel() { return sizelevel; } // ✅ Fix lỗi getSizelevel()
        public void setSizelevel(String sizelevel) { this.sizelevel = sizelevel; }

        public String getSugarlevel() { return sugarlevel; } // ✅ Fix lỗi getSugarlevel()
        public void setSugarlevel(String sugarlevel) { this.sugarlevel = sugarlevel; }

        public String getIcelevel() { return icelevel; } // ✅ Fix lỗi getIcelevel()
        public void setIcelevel(String icelevel) { this.icelevel = icelevel; }
    }
}
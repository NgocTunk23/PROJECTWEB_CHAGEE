package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "SocialAccounts")
public class SocialAccount {
    
    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP - 3 CỘT)
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        
        @Column(name = "buyerusername")
        private String buyerusername;

        @Column(name = "providername", length = 20)
        private String providername; 

        @Column(name = "providerid", length = 255)
        private String providerid;   

        public Id() {}

        public Id(String buyerusername, String providername, String providerid) {
            this.buyerusername = buyerusername;
            this.providername = providername;
            this.providerid = providerid;
        }

        // --- Getters & Setters (Viết liền theo SQL) ---
        public String getBuyerusername() { return buyerusername; }
        public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

        public String getProvidername() { return providername; }
        public void setProvidername(String providername) { this.providername = providername; }

        public String getProviderid() { return providerid; }
        public void setProviderid(String providerid) { this.providerid = providerid; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(buyerusername, id.buyerusername) &&
                   Objects.equals(providername, id.providername) &&
                   Objects.equals(providerid, id.providerid);
        }

        @Override
        public int hashCode() {
            return Objects.hash(buyerusername, providername, providerid);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH ENTITY
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("buyerusername") 
    @JoinColumn(name = "buyerusername")
    private Buyer buyer;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    public SocialAccount() {}

    public SocialAccount(Buyer buyer, String providername, String providerid) {
        this.buyer = buyer;
        this.id = new Id(buyer.getUsername(), providername, providerid);
    }

    // ========================================================================
    // 4. GETTERS & SETTERS (Cập nhật tên phương thức)
    // ========================================================================

    public Id getId() { return id; }
    public void setId(Id id) { this.id = id; }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        if (buyer != null) {
            if (this.id == null) this.id = new Id();
            this.id.setBuyerusername(buyer.getUsername());
        }
    }

    // --- Helper Methods (Tiện ích lấy thông tin nhanh) ---
    public String getProvidername() {
        return id != null ? id.getProvidername() : null;
    }

    public String getProviderid() {
        return id != null ? id.getProviderid() : null;
    }
}
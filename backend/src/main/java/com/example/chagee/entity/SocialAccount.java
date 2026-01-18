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
        // Phần này sẽ được map tự động thông qua @MapsId ở dưới
        private String buyerUsername;

        @Column(name = "provider_name", length = 20)
        private String providerName; // VD: 'GOOGLE', 'APPLE'

        @Column(name = "provider_id", length = 255)
        private String providerId;   // ID định danh từ phía Google/Apple gửi về

        // --- Constructors ---
        public Id() {}

        public Id(String buyerUsername, String providerName, String providerId) {
            this.buyerUsername = buyerUsername;
            this.providerName = providerName;
            this.providerId = providerId;
        }

        // --- Getters & Setters ---
        public String getBuyerUsername() { return buyerUsername; }
        public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

        public String getProviderName() { return providerName; }
        public void setProviderName(String providerName) { this.providerName = providerName; }

        public String getProviderId() { return providerId; }
        public void setProviderId(String providerId) { this.providerId = providerId; }

        // --- Bắt buộc: Equals & HashCode ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(buyerUsername, id.buyerUsername) &&
                   Objects.equals(providerName, id.providerName) &&
                   Objects.equals(providerId, id.providerId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(buyerUsername, providerName, providerId);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH ENTITY
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("buyerUsername") // Map biến buyerUsername trong Id với đối tượng Buyer
    @JoinColumn(name = "buyer_username")
    private Buyer buyer;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    public SocialAccount() {}

    public SocialAccount(Buyer buyer, String providerName, String providerId) {
        this.buyer = buyer;
        // Tự động khởi tạo ID từ các thông tin truyền vào
        this.id = new Id(buyer.getUsername(), providerName, providerId);
    }

    // ========================================================================
    // 4. GETTERS & SETTERS
    // ========================================================================

    public Id getId() {
        return id;
    }

    public void setId(Id id) {
        this.id = id;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        // Logic cập nhật ID đồng bộ khi set Buyer
        if (buyer != null) {
            if (this.id == null) this.id = new Id();
            this.id.setBuyerUsername(buyer.getUsername());
        }
    }

    // --- Helper Methods (Tiện ích để lấy thông tin nhanh) ---
    
    public String getProviderName() {
        return id != null ? id.getProviderName() : null;
    }

    public String getProviderId() {
        return id != null ? id.getProviderId() : null;
    }
}
package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "AccountBans")
public class AccountBan {

    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP)
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        private String adminUsername;
        private String buyerUsername;

        // --- Bắt buộc phải có Constructor mặc định ---
        public Id() {}

        public Id(String adminUsername, String buyerUsername) {
            this.adminUsername = adminUsername;
            this.buyerUsername = buyerUsername;
        }

        // --- Bắt buộc phải có Getter & Setter ---
        public String getAdminUsername() { return adminUsername; }
        public void setAdminUsername(String adminUsername) { this.adminUsername = adminUsername; }

        public String getBuyerUsername() { return buyerUsername; }
        public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

        // --- QUAN TRỌNG: Phải có equals và hashCode để so sánh ID ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return  Objects.equals(adminUsername, id.adminUsername) && Objects.equals(buyerUsername, id.buyerUsername);
        }

        @Override
        public int hashCode() {
            return Objects.hash(adminUsername, buyerUsername);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH CỦA ACCOUNT BAN
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("adminUsername") // Map với biến adminUsername trong class Id ở trên
    @JoinColumn(name = "admin_username")
    private Admin admin;

    @ManyToOne
    @MapsId("buyerUsername") // Map với biến buyerUsername trong class Id ở trên
    @JoinColumn(name = "buyer_username")
    private Buyer buyer;

    @Column(name = "ban_time")
    private LocalDateTime banTime;

    @Column(name = "reason")
    private String reason;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    
    public AccountBan() {}

    // Constructor tiện lợi: Truyền object vào, tự động tạo ID luôn
    public AccountBan(Admin admin, Buyer buyer, String reason) {
        this.admin = admin;
        this.buyer = buyer;
        this.reason = reason;
        this.banTime = LocalDateTime.now();
        // Tự động tạo ID từ 2 object này
        this.id = new Id(admin.getUsername(), buyer.getUsername());
    }

    // ========================================================================
    // 4. GETTERS & SETTERS CHO ENTITY
    // ========================================================================

    public Id getId() { return id; }
    public void setId(Id id) { this.id = id; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) {
        this.admin = admin;
        // Cập nhật lại ID nếu set Admin mới
        if (admin != null) {
            if (this.id == null) this.id = new Id();
            this.id.setAdminUsername(admin.getUsername());
        }
    }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        // Cập nhật lại ID nếu set Buyer mới
        if (buyer != null) {
            if (this.id == null) this.id = new Id();
            this.id.setBuyerUsername(buyer.getUsername());
        }
    }

    public LocalDateTime getBanTime() { return banTime; }
    public void setBanTime(LocalDateTime banTime) { this.banTime = banTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
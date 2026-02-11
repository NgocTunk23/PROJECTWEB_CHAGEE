package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "AccountBans")
public class AccountBan {

    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP)
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        @Column(name = "adminusername")
        private String adminusername;

        @Column(name = "buyerusername")
        private String buyerusername;

        public Id() {}

        public Id(String adminusername, String buyerusername) {
            this.adminusername = adminusername;
            this.buyerusername = buyerusername;
        }

        // --- Getters & Setters theo tên viết liền ---
        public String getAdminusername() { return adminusername; }
        public void setAdminusername(String adminusername) { this.adminusername = adminusername; }

        public String getBuyerusername() { return buyerusername; }
        public void setBuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(adminusername, id.adminusername) && 
                   Objects.equals(buyerusername, id.buyerusername);
        }

        @Override
        public int hashCode() {
            return Objects.hash(adminusername, buyerusername);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH CỦA ACCOUNT BAN
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("adminusername") 
    @JoinColumn(name = "adminusername")
    private Admin admin;

    @ManyToOne
    @MapsId("buyerusername") 
    @JoinColumn(name = "buyerusername")
    private Buyer buyer;

    @Column(name = "bantime") // Khớp: bantime DATETIME
    @Temporal(TemporalType.TIMESTAMP)
    private Date bantime;

    @Column(name = "reason", columnDefinition = "NVARCHAR(255)") // Khớp: reason NVARCHAR(255)
    private String reason;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    
    public AccountBan() {
        this.bantime = new Date();
    }

    public AccountBan(Admin admin, Buyer buyer, String reason) {
        this.admin = admin;
        this.buyer = buyer;
        this.reason = reason;
        this.bantime = new Date();
        this.id = new Id(admin.getUsername(), buyer.getUsername());
    }

    // ========================================================================
    // 4. GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================

    public Id getId() { return id; }
    public void setId(Id id) { this.id = id; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) {
        this.admin = admin;
        if (admin != null) {
            if (this.id == null) this.id = new Id();
            this.id.setAdminusername(admin.getUsername());
        }
    }

    public Buyer getBuyer() { return buyer; }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
        if (buyer != null) {
            if (this.id == null) this.id = new Id();
            this.id.setBuyerusername(buyer.getUsername());
        }
    }

    public Date getBantime() { return bantime; }
    public void setBantime(Date bantime) { this.bantime = bantime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
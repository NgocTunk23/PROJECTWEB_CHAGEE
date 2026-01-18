package com.example.chagee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "BuyerBankAccounts")
public class BuyerBankAccount {

    // ========================================================================
    // 1. CLASS ID (KHÓA CHÍNH PHỨC HỢP - 3 CỘT)
    // ========================================================================
    @Embeddable
    public static class Id implements Serializable {
        private String buyerUsername;
        @Column(name = "bank_name") // Map rõ tên cột vì tên biến kiểu lạc đà
        private String bankName;
        @Column(name = "account_number")
        private String accountNumber;

        public Id() {}

        public Id(String buyerUsername, String bankName, String accountNumber) {
            this.buyerUsername = buyerUsername;
            this.bankName = bankName;
            this.accountNumber = accountNumber;
        }

        // --- Getters & Setters cho ID ---
        public String getBuyerUsername() { return buyerUsername; }
        public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

        // --- Bắt buộc phải có equals và hashCode ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(buyerUsername, id.buyerUsername) &&
                    Objects.equals(bankName, id.bankName) &&
                    Objects.equals(accountNumber, id.accountNumber);
        }

        @Override
        public int hashCode() {
            return Objects.hash(buyerUsername, bankName, accountNumber);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH CHÍNH
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("buyerUsername") // Map tới thuộc tính buyerUsername trong Id
    @JoinColumn(name = "buyer_username")
    private Buyer buyer;

    @Column(name = "card_type")
    private String cardType;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    public BuyerBankAccount() {}

    public BuyerBankAccount(Buyer buyer, String bankName, String accountNumber, String cardType) {
        this.buyer = buyer;
        this.cardType = cardType;
        // Tự động tạo ID từ các thông tin đầu vào
        this.id = new Id(buyer.getUsername(), bankName, accountNumber);
    }

    // ========================================================================
    // 4. GETTERS & SETTERS (FULL)
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
        // Logic tự động cập nhật ID khi set Buyer
        if (buyer != null) {
            if (this.id == null) this.id = new Id();
            this.id.setBuyerUsername(buyer.getUsername());
        }
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
    
    // Các helper method để lấy bankName và accountNumber tiện hơn
    // (Thay vì phải gọi entity.getId().getBankName())
    public String getBankName() {
        return id != null ? id.getBankName() : null;
    }
    
    public String getAccountNumber() {
        return id != null ? id.getAccountNumber() : null;
    }
}
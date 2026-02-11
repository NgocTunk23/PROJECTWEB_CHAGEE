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
        @Column(name = "buyerusername")
        private String buyerusername;
        @Column(name = "bankname", columnDefinition = "NVARCHAR(255)") // Map rõ tên cột vì tên biến kiểu lạc đà
        private String bankname;
        @Column(name = "accountnumber")
        private String accountnumber;

        public Id() {}

        public Id(String buyerusername, String bankname, String accountnumber) {
            this.buyerusername = buyerusername;
            this.bankname = bankname;
            this.accountnumber = accountnumber;
        }

        // --- Getters & Setters cho ID ---
        public String getbuyerusername() { return buyerusername; }
        public void setbuyerusername(String buyerusername) { this.buyerusername = buyerusername; }

        public String getbankname() { return bankname; }
        public void setbankname(String bankname) { this.bankname = bankname; }

        public String getaccountnumber() { return accountnumber; }
        public void setaccountnumber(String accountnumber) { this.accountnumber = accountnumber; }

        // --- Bắt buộc phải có equals và hashCode ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Id id = (Id) o;
            return Objects.equals(buyerusername, id.buyerusername) &&
                    Objects.equals(bankname, id.bankname) &&
                    Objects.equals(accountnumber, id.accountnumber);
        }

        @Override
        public int hashCode() {
            return Objects.hash(buyerusername, bankname, accountnumber);
        }
    }

    // ========================================================================
    // 2. THUỘC TÍNH CHÍNH
    // ========================================================================

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("buyerusername") // Map tới thuộc tính buyerusername trong Id
    @JoinColumn(name = "buyerusername")
    private Buyer buyer;

    @Column(name = "cardtype", columnDefinition = "NVARCHAR(255)")
    private String cardtype;

    // ========================================================================
    // 3. CONSTRUCTORS
    // ========================================================================
    public BuyerBankAccount() {}

    public BuyerBankAccount(Buyer buyer, String bankname, String accountnumber, String cardType) {
        this.buyer = buyer;
        this.cardtype = cardType;
        // Tự động tạo ID từ các thông tin đầu vào
        this.id = new Id(buyer.getUsername(), bankname, accountnumber);
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
            this.id.setbuyerusername(buyer.getUsername());
        }
    }

    public String getCardType() {
        return cardtype;
    }

    public void setCardType(String cardType) {
        this.cardtype = cardType;
    }
    
    // Các helper method để lấy bankname và accountnumber tiện hơn
    // (Thay vì phải gọi entity.getId().getbankname())
    public String getbankname() {
        return id != null ? id.getbankname() : null;
    }
    
    public String getaccountnumber() {
        return id != null ? id.getaccountnumber() : null;
    }
}
package com.example.chagee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Branches") // Khớp: Branches
public class Branch {
    @Id
    @Column(name = "branchid", length = 255) // Khớp: branchid VARCHAR(255)
    private String branchid;

    @Column(name = "addressU", nullable = false) // Khớp: addressU NVARCHAR(255)
    private String address;

    @ManyToOne
    @JoinColumn(name = "managerusername") // Khớp: managerusername VARCHAR(255)
    private Admin managerusername;

    public Branch() {}

    // ========================================================================
    // GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================
    public String getBranchid() { return branchid; }
    public void setBranchid(String branchid) { this.branchid = branchid; }

    public String getAddressU() { return address; }
    public void setAddressU(String address) { this.address= address; }

    public Admin getManagerusername() { return managerusername; }
    public void setManagerusername(Admin managerusername) { this.managerusername = managerusername; }
}
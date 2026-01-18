package com.example.chagee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Branches")
public class Branch {
    @Id
    @Column(name = "branch_id", length = 50)
    private String branchId;

    @Column(name = "addressU", nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "manager_username")
    private Admin manager;

    public Branch() {}

    // Getters và Setters
    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Admin getManager() { return manager; }
    public void setManager(Admin manager) { this.manager = manager; }
}

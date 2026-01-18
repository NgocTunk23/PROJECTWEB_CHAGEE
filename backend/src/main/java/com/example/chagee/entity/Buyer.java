package com.example.chagee.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Buyers")
public class Buyer {
    @Id
    @Column(length = 50)
    private String username;

    @Column(name = "passwordU", nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    private String phone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "full_name")
    private String fullName;

    private LocalDate dob;
    
    @Column(name = "reward_points")
    private Integer rewardPoints;

    @Column(name = "membership_tier")
    private String membershipTier;

    public Buyer() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.rewardPoints == null) this.rewardPoints = 0;
        if (this.membershipTier == null) this.membershipTier = "Bronze";
    }

    // Getters và Setters cơ bản
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public Integer getRewardPoints() { return rewardPoints; }
    public void setRewardPoints(Integer rewardPoints) { this.rewardPoints = rewardPoints; }

    public String getMembershipTier() { return membershipTier; }
    public void setMembershipTier(String membershipTier) { this.membershipTier = membershipTier;}
}
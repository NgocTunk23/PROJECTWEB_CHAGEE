package com.example.chagee.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Buyers") // Khớp: Buyers
public class Buyer {

    @Id
    @Column(name = "username") // Khớp: username VARCHAR(255)
    private String username;

    @Column(name = "passwordU", nullable = false) // Khớp: passwordU VARCHAR(255)
    private String password;

    @Column(name = "email", unique = true) // Khớp: email VARCHAR(100)
    private String email;

    @Column(name = "phonenumber") // Khớp: phonenumber VARCHAR(20)
    private String phonenumber;

    @Column(name = "createdat") // Khớp: createdat DATETIME
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdat;

    @Column(name = "fullname") // Khớp: fullname NVARCHAR(100)
    private String fullname;

    @Column(name = "dob") // Khớp: dob DATE
    @Temporal(TemporalType.DATE)
    private Date dob;

    @Column(name = "avatarlink", columnDefinition = "VARCHAR(MAX)") // Khớp: avatarlink VARCHAR(MAX)
    private String avatarlink;

    @Column(name = "gender", length = 10) // Khớp: gender NVARCHAR(10)
    private String gender;

    @Column(name = "permissionlevel") // Khớp: permissionlevel INT
    private Integer permissionlevel;

    @Column(name = "rewardpoints") // Khớp: rewardpoints INT
    private Integer rewardpoints;

    @Column(name = "loyaltycode") // Khớp: loyaltycode VARCHAR(255)
    private String loyaltycode;

    @Column(name = "membershiptier") // Khớp: membershiptier NVARCHAR(255)
    private String membershiptier;

    public Buyer() {
        this.createdat = new Date();
        this.membershiptier = "Member";
        this.rewardpoints = 0;
        this.permissionlevel = 0;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdat == null) this.createdat = new Date();
        if (this.permissionlevel == null) this.permissionlevel = 0;
        if (this.rewardpoints == null) this.rewardpoints = 0;
        if (this.membershiptier == null) this.membershiptier = "Member";
    }

    // ========================================================================
    // GETTERS & SETTERS (Đã đổi tên theo biến viết liền)
    // ========================================================================
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }

    public Date getCreatedat() { return createdat; }
    public void setCreatedat(Date createdat) { this.createdat = createdat; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }

    public String getAvatarlink() { return avatarlink; }
    public void setAvatarlink(String avatarlink) { this.avatarlink = avatarlink; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getPermissionlevel() { return permissionlevel; }
    public void setPermissionlevel(Integer permissionlevel) { this.permissionlevel = permissionlevel; }

    public Integer getRewardpoints() { return rewardpoints; }
    public void setRewardpoints(Integer rewardpoints) { this.rewardpoints = rewardpoints; }

    public String getLoyaltycode() { return loyaltycode; }
    public void setLoyaltycode(String loyaltycode) { this.loyaltycode = loyaltycode; }

    public String getMembershiptier() { return membershiptier; }
    public void setMembershiptier(String membershiptier) { this.membershiptier = membershiptier; }
}
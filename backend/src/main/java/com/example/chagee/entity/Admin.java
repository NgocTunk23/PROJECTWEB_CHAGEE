package com.example.chagee.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Admins")
public class Admin {

    // ========================================================================
    // 1. KHAI BÁO THUỘC TÍNH (FIELDS)
    // ========================================================================

    @Id
    @Column(name = "username", length = 50, nullable = false)
    private String username;

    @Column(name = "passwordU", nullable = false, length = 255)
    private String password;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "avatar_link", columnDefinition = "VARCHAR(MAX)")
    private String avatarLink;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "permission_level")
    private Integer permissionLevel;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // ========================================================================
    // 2. CONSTRUCTORS
    // ========================================================================

    // Constructor mặc định (Bắt buộc đối với JPA)
    public Admin() {
    }

    // Constructor đầy đủ (Tùy chọn, tiện cho việc khởi tạo nhanh)
    public Admin(String username, String password, String email, String fullName, Integer permissionLevel) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.permissionLevel = permissionLevel;
    }

    // ========================================================================
    // 3. LIFECYCLE CALLBACKS
    // ========================================================================

    // Tự động gán thời gian tạo khi lưu mới vào database nếu chưa có
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        // Mặc định permission là 1 nếu không set
        if (this.permissionLevel == null) {
            this.permissionLevel = 1;
        }
    }

    // ========================================================================
    // 4. GETTERS VÀ SETTERS (ĐẦY ĐỦ)
    // ========================================================================

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAvatarLink() {
        return avatarLink;
    }

    public void setAvatarLink(String avatarLink) {
        this.avatarLink = avatarLink;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(Integer permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
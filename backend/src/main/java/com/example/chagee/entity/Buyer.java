// File: backend/src/main/java/com/example/chagee/entity/Buyer.java
package com.example.chagee.entity;

import jakarta.persistence.*;
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

    // --- THÊM TRƯỜNG NÀY ---
    @Column(name = "permission_level", columnDefinition = "int default 0")
    private Integer permissionLevel;

    public Buyer() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.permissionLevel == null) this.permissionLevel = 0; // Mặc định là Customer
    }

    // Getters & Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getPermissionLevel() { return permissionLevel; }
    public void setPermissionLevel(Integer permissionLevel) { this.permissionLevel = permissionLevel; }
}
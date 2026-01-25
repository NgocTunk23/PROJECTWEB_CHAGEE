// File: backend/src/main/java/com/example/chagee/entity/Admin.java
package com.example.chagee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Admins")
public class Admin {
    @Id
    @Column(length = 50)
    private String username;

    @Column(name = "passwordU", nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(name = "phonenumber")
    private String phonenumber;

    // --- THÊM TRƯỜNG NÀY ---
    @Column(name = "permission_level", columnDefinition = "int default 1")
    private Integer permissionLevel;

    public Admin() {}

    @PrePersist
    protected void onCreate() {
        if (this.permissionLevel == null) this.permissionLevel = 1; // Mặc định là Staff
    }

    // Getters & Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getPermissionLevel() { return permissionLevel; }
    public void setPermissionLevel(Integer permissionLevel) { this.permissionLevel = permissionLevel; }
}
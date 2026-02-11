package com.example.chagee.entity;
import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "Admins")
public class Admin {
    @Id
    @Column(name = "username")
    private String username;

    @Column(name = "passwordU", nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    @Column(name = "phonenumber")
    private String phonenumber;

    @Column(name = "createdat")
    private Date createdat;

    @Column(name = "fullname", columnDefinition = "NVARCHAR(100)")
    private String fullname;

    @Column(name = "dob")
    @Temporal(TemporalType.DATE) // Chỉ định đây là ngày sinh (chỉ có ngày, không giờ)
    private Date dob;

    @Column(name = "avatarlink", columnDefinition = "VARCHAR(MAX)") // Hoặc để String bình thường cũng được
    private String avatarlink;

    @Column(name = "gender", columnDefinition = "NVARCHAR(10)")
    private String gender;

    @Column(name = "permissionlevel", columnDefinition = "int default 1")
    private Integer permissionlevel;

    @Column(name = "lastlogin")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastlogin;

    public Admin() {}

    @PrePersist
    protected void onCreate() {
        if (this.permissionlevel == null) this.permissionlevel = 1; // Mặc định là Staff
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getPermissionlevel() { return permissionlevel; }
    public void setPermissionlevel(Integer permissionlevel) { this.permissionlevel = permissionlevel; }
}
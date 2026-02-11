package com.example.chagee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Branches")
public class Branch {

    // 1. Khóa chính: branchid
    @Id
    @Column(name = "branchid")
    private String branchid;

    // 2. Tên hiển thị: branch_name (NVARCHAR)
    @Column(name = "branch_name", columnDefinition = "NVARCHAR(255)")
    private String branchName;

    // 3. Địa chỉ: addressU (NVARCHAR)
    // Lưu ý: Tên cột trong SQL là addressU, nên name="addressU"
    @Column(name = "addressU", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String address;

    // 4. Tọa độ: latitude, longitude
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    // 5. Giờ mở/đóng cửa
    @Column(name = "open_time", length = 5)
    private String openTime;

    @Column(name = "close_time", length = 5)
    private String closeTime;

    // 6. Khóa ngoại: managerusername
    // Map tới bảng Admins
    @ManyToOne
    @JoinColumn(name = "managerusername") 
    private Admin managerusername; 

    // ========================================================================
    // CONSTRUCTOR
    // ========================================================================
    public Branch() {}

    // ========================================================================
    // GETTERS & SETTERS
    // ========================================================================
    
    public String getBranchid() {
        return branchid;
    }

    public void setBranchid(String branchid) {
        this.branchid = branchid;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(String closeTime) {
        this.closeTime = closeTime;
    }

    public Admin getManagerusername() {
        return managerusername;
    }

    public void setManagerusername(Admin managerusername) {
        this.managerusername = managerusername;
    }
}
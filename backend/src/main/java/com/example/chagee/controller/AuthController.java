package com.example.chagee.controller;

import com.example.chagee.entity.Admin;
import com.example.chagee.entity.Buyer;
import com.example.chagee.repository.AdminRepository;
import com.example.chagee.repository.BuyerRepository;
import com.example.chagee.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    BuyerRepository buyerRepository;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // --- API ĐĂNG NHẬP ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // 1. Kiểm tra bảng ADMIN
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (encoder.matches(password, admin.getPassword())) {
                String role = (admin.getPermissionlevel() != null && admin.getPermissionlevel() == 10) ? "ADMIN" : "STAFF";
                String token = jwtUtils.generateToken(admin.getUsername(), role);
                String fullname = (admin.getFullname() != null) ? admin.getFullname() : admin.getUsername();
                return ResponseEntity.ok(new JwtResponse(token, admin.getUsername(), role, 0, fullname, admin.getPhonenumber()));
            }
        }

        // 2. Kiểm tra bảng BUYER
        Optional<Buyer> buyerOpt = buyerRepository.findByUsername(username);
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            if (encoder.matches(password, buyer.getPassword())) {
                String role = "CUSTOMER"; 
                String token = jwtUtils.generateToken(buyer.getUsername(), role);
                int points = (buyer.getRewardpoints() != null) ? buyer.getRewardpoints() : 0;
                return ResponseEntity.ok(new JwtResponse(token, buyer.getUsername(), role, points, buyer.getFullname(), buyer.getPhonenumber()));
            }
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password!"));
    }

    // --- API ĐĂNG KÝ (Đã sửa logic check trùng và gán biến) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        
        // 1. Chặn trùng Username (Tránh lỗi 500 khóa chính)
        if (buyerRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Tên đăng nhập đã tồn tại!"));
        }

        // 2. Chặn trùng Email (Tránh lỗi 500 unique constraint)
        if (buyerRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email đã được sử dụng!"));
        }

        // 3. Chặn trùng Số điện thoại
        if (buyerRepository.existsByPhonenumber(signUpRequest.getPhonenumber())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Số điện thoại đã được đăng ký!"));
        }

        // 4. Tạo User mới và lưu
        Buyer user = new Buyer();
        user.setUsername(signUpRequest.getUsername()); // ✅ Dùng đúng Username khách nhập
        user.setEmail(signUpRequest.getEmail());       // ✅ Lưu Email
        user.setFullname(signUpRequest.getFullname());
        user.setPhonenumber(signUpRequest.getPhonenumber());
        user.setPassword(encoder.encode(signUpRequest.getPassword())); // Lưu vào passwordU
        
        // Các trường RewardPoints, Permission, MembershipTier đã được gán mặc định trong Buyer Constructor
        Buyer savedUser = buyerRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // --- DTO CLASSES ---

    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        @NotBlank private String username;    // ✅ Đã thêm
        @NotBlank private String email;       // ✅ Đã thêm
        @NotBlank private String fullname;
        @NotBlank private String phonenumber;
        @NotBlank private String password;

        // Getters & Setters đầy đủ
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullname() { return fullname; }
        public void setFullname(String fullname) { this.fullname = fullname; }
        public String getPhonenumber() { return phonenumber; }
        public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private String username;
        private String role;
        private int rewardpoints;
        private String fullname;
        private String phonenumber;

        public JwtResponse(String accessToken, String username, String role, int rewardpoints, String fullname, String phonenumber) {
            this.token = accessToken;
            this.username = username;
            this.role = role;
            this.rewardpoints = rewardpoints;
            this.fullname = fullname;
            this.phonenumber = phonenumber;
        }

        // Getters & Setters
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public int getRewardpoints() { return rewardpoints; }
        public void setRewardpoints(int rewardpoints) { this.rewardpoints = rewardpoints; }
        public String getFullname() { return fullname; }
        public void setFullname(String fullname) { this.fullname = fullname; }
        public String getPhonenumber() { return phonenumber; }
        public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
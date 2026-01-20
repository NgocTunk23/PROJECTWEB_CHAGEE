// File: backend/src/main/java/com/example/chagee/controller/AuthController.java
package com.example.chagee.controller;

import com.example.chagee.entity.Admin;
import com.example.chagee.entity.Buyer;
import com.example.chagee.repository.AdminRepository;
import com.example.chagee.repository.BuyerRepository;
import com.example.chagee.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager; // Có thể không cần dùng nếu tự check password thủ công

    @Autowired
    BuyerRepository buyerRepository;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // --- API ĐĂNG NHẬP (LOGIC MỚI) ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // BƯỚC 1: Kiểm tra trong bảng ADMIN trước
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            // Kiểm tra mật khẩu
            if (encoder.matches(password, admin.getPassword())) {
                // Xác định Role dựa trên permission_level
                String role = "STAFF"; // Mặc định level 1
                if (admin.getPermissionLevel() != null && admin.getPermissionLevel() == 10) {
                    role = "ADMIN";
                }
                
                String token = jwtUtils.generateToken(admin.getUsername(), role);
                return ResponseEntity.ok(new JwtResponse(token, admin.getUsername(), role));
            }
        }

        // BƯỚC 2: Nếu không phải Admin, kiểm tra bảng BUYER
        Optional<Buyer> buyerOpt = buyerRepository.findByUsername(username);
        // Lưu ý: Nếu Buyer đăng nhập bằng SĐT, dùng buyerRepository.findByPhone(username)
        
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            if (encoder.matches(password, buyer.getPassword())) {
                String role = "CUSTOMER"; // Level 0
                String token = jwtUtils.generateToken(buyer.getUsername(), role);
                return ResponseEntity.ok(new JwtResponse(token, buyer.getUsername(), role));
            }
        }

        // Nếu không tìm thấy ở cả 2 bảng hoặc sai mật khẩu
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password!"));
    }

    // --- API ĐĂNG KÝ (Giữ nguyên cho Buyer - Role mặc định Customer) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (buyerRepository.existsByPhone(signUpRequest.getPhone())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already taken!"));
        }

        Buyer user = new Buyer();
        // Buyer mặc định permission_level = 0
        user.setPermissionLevel(0); 
        
        user.setUsername(signUpRequest.getPhone()); // Lấy SĐT làm username
        user.setFullName(signUpRequest.getName());
        user.setPhone(signUpRequest.getPhone());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        buyerRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // --- DTO Classes ---
    public static class LoginRequest {
        private String username;
        private String password;
        // Getters/Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        private String name;
        private String phone;
        private String password;
        // Getters/Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private String username;
        private String role;
        
        public JwtResponse(String accessToken, String username, String role) {
            this.token = accessToken;
            this.username = username;
            this.role = role;
        }
        // --- CÁC GETTER ---
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; } // Nên có thêm setter nếu cần
        
        // ==> THÊM HÀM NÀY ĐỂ HẾT CẢNH BÁO <==
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
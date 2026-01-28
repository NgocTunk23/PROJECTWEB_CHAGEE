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

        // BƯỚC 1: Kiểm tra trong bảng ADMIN
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            // passwordU: Khớp với entity Admin
            if (encoder.matches(password, admin.getPassword())) {
                String role = "STAFF"; 
                if (admin.getPermissionlevel() != null && admin.getPermissionlevel() == 10) {
                    role = "ADMIN";
                }
                
                String token = jwtUtils.generateToken(admin.getUsername(), role);
                return ResponseEntity.ok(new JwtResponse(token, admin.getUsername(), role, 0));
            }
        }

        // BƯỚC 2: Kiểm tra bảng BUYER
        Optional<Buyer> buyerOpt = buyerRepository.findByUsername(username);
        
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            // passwordU: Khớp với entity Buyer
            if (encoder.matches(password, buyer.getPassword())) {
                String role = "CUSTOMER"; 
                String token = jwtUtils.generateToken(buyer.getUsername(), role);
                
                // rewardpoints: Khớp với entity Buyer
                int points = buyer.getRewardpoints() != null ? buyer.getRewardpoints() : 0;
                
                return ResponseEntity.ok(new JwtResponse(token, buyer.getUsername(), role, points));
            }
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password!"));
    }

    // --- API ĐĂNG KÝ (Cho Buyer) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // existsByPhonenumber: Cần đảm bảo Repository có method này
        if (buyerRepository.existsByPhonenumber(signUpRequest.getPhonenumber())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already taken!"));
        }

        Buyer user = new Buyer();
        user.setPermissionlevel(0); 
        user.setUsername(signUpRequest.getPhonenumber()); // Dùng SĐT làm username
        user.setFullname(signUpRequest.getFullname());
        user.setPhonenumber(signUpRequest.getPhonenumber());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRewardpoints(0); 

        buyerRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // --- DTO Classes ---
    public static class LoginRequest {
        @NotBlank
        private String username;
        @NotBlank
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        @NotBlank
        private String fullname; // Đổi từ name -> fullname
        @NotBlank
        private String phonenumber; // Đổi từ phone -> phonenumber
        @NotBlank
        private String password;
        
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
        private int rewardpoints; // Đổi từ rewardPoints -> rewardpoints
        
        public JwtResponse(String accessToken, String username, String role, int rewardpoints) {
            this.token = accessToken;
            this.username = username;
            this.role = role;
            this.rewardpoints = rewardpoints;
        }
        
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
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
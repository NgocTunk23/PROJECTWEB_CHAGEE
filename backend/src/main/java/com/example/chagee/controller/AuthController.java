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

    // --- API ĐĂNG NHẬP (LOGIC TÌM KIẾM ĐA BẢNG) ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // BƯỚC 1: Kiểm tra trong bảng ADMIN trước
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            // Kiểm tra mật khẩu (Dùng encoder.matches nếu đã mã hóa, hoặc equals nếu chưa)
            if (encoder.matches(password, admin.getPassword())) {
                // Xác định Role dựa trên permission_level
                String role = "STAFF"; // Mặc định level 1
                if (admin.getPermissionLevel() != null && admin.getPermissionLevel() == 10) {
                    role = "ADMIN";
                }
                
                String token = jwtUtils.generateToken(admin.getUsername(), role);
                // Admin không có điểm thưởng -> rewardPoints = 0
                return ResponseEntity.ok(new JwtResponse(token, admin.getUsername(), role, 0));
            }
        }

        // BƯỚC 2: Nếu không phải Admin, kiểm tra bảng BUYER
        Optional<Buyer> buyerOpt = buyerRepository.findByUsername(username);
        // Lưu ý: Nếu user nhập SĐT để login thì dùng buyerRepository.findByPhone(username)
        
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            if (encoder.matches(password, buyer.getPassword())) {
                String role = "CUSTOMER"; // Level 0
                String token = jwtUtils.generateToken(buyer.getUsername(), role);
                
                // Lấy điểm thưởng từ Buyer (xử lý null an toàn)
                int points = buyer.getRewardPoints() != null ? buyer.getRewardPoints() : 0;
                
                return ResponseEntity.ok(new JwtResponse(token, buyer.getUsername(), role, points));
            }
        }

        // Nếu không tìm thấy ở cả 2 bảng hoặc sai mật khẩu
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password!"));
    }

    // --- API ĐĂNG KÝ (Cho Buyer) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Kiểm tra trùng SĐT (dùng làm username)
        if (buyerRepository.existsByPhonenumber(signUpRequest.getPhone())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already taken!"));
        }

        Buyer user = new Buyer();
        user.setPermissionLevel(0); // Mặc định Customer
        
        // Logic: Lấy SĐT làm username luôn cho tiện
        user.setUsername(signUpRequest.getPhone()); 
        user.setFullName(signUpRequest.getName());
        user.setPhone(signUpRequest.getPhone());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRewardPoints(0); // Mặc định 0 điểm khi mới tạo

        buyerRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // --- DTO Classes ---
    public static class LoginRequest {
        @NotBlank
        private String username;
        @NotBlank
        private String password;
        
        // Getters/Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String phone;
        @NotBlank
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
        private int rewardPoints; // Thêm trường điểm thưởng
        
        public JwtResponse(String accessToken, String username, String role, int rewardPoints) {
            this.token = accessToken;
            this.username = username;
            this.role = role;
            this.rewardPoints = rewardPoints;
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
        
        public int getRewardPoints() { return rewardPoints; }
        public void setRewardPoints(int rewardPoints) { this.rewardPoints = rewardPoints; }
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
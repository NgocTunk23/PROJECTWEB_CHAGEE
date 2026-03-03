package com.example.chagee.controller;

import com.example.chagee.entity.Voucher;
import com.example.chagee.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*") // ✅ Cho phép Frontend truy cập không bị lỗi CORS
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    /**
     * ✅ 1. Lấy tất cả voucher còn hạn (Dùng cho khách hoặc xem chung)
     * URL: GET http://localhost:8080/api/vouchers
     */
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllValidVouchers() {
        return ResponseEntity.ok(voucherService.getValidVouchers());
    }

    /**
     * ✅ 2. Lấy voucher KHẢ DỤNG cho từng User cụ thể
     * Logic: Lọc bỏ những mã mà User này đã dùng rồi.
     * URL: GET http://localhost:8080/api/vouchers/available?username=toon123
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableVouchers(@RequestParam String username) {
        try {
            // Kiểm tra tham số đầu vào để tránh lỗi Null
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lỗi: Cần cung cấp username để lọc voucher!");
            }

            // Gọi Service để lấy danh sách voucher chưa dùng
            List<Voucher> availableVouchers = voucherService.getAvailableVouchersForUser(username);
            
            return ResponseEntity.ok(availableVouchers);
        } catch (Exception e) {
            // Trả về lỗi 500 nếu có vấn đề về Database
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
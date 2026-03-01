package com.example.chagee.controller;

import com.example.chagee.entity.Voucher;
import com.example.chagee.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*") // ✅ Đảm bảo dòng này có mặt để "thông quan" trình duyệt
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // API: Lấy tất cả danh sách Voucher còn hạn sử dụng
    // URL: http://localhost:8080/api/vouchers
    @GetMapping
    public ResponseEntity<List<Voucher>> getVouchers() {
        // Gọi hàm lấy tất cả voucher còn hạn từ Service
        return ResponseEntity.ok(voucherService.getValidVouchers());
    }
}
package com.example.chagee.service;

import com.example.chagee.entity.Voucher;
import com.example.chagee.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    /**
     * ✅ 1. Lấy tất cả voucher còn hạn (Cho khách vãng lai)
     */
    public List<Voucher> getValidVouchers() {
        return voucherRepository.getValidVouchers();
    }

    /**
     * ✅ 2. HÀM MỚI: Lấy voucher chưa dùng cho từng User cụ thể
     * Hàm này đóng vai trò cầu nối để Controller gọi được câu Query Native ở Repository
     */
    public List<Voucher> getAvailableVouchersForUser(String username) {
        // Gọi trực tiếp câu Query "NOT IN" mà anh em mình vừa viết ở Repository
        return voucherRepository.findAvailableVouchersForUser(username);
    }
}
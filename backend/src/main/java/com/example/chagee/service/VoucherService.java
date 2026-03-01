package com.example.chagee.service;

import com.example.chagee.entity.Voucher;
import com.example.chagee.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    /**
     * Lấy danh sách các voucher có ngày hết hạn >= ngày hôm nay
     */
    public List<Voucher> getValidVouchers() {
        LocalDate today = LocalDate.now();
        // Gọi Repository để lọc theo ngày
        return voucherRepository.findByExpirydateGreaterThanEqualOrderByExpirydateAsc(today);
    }
}
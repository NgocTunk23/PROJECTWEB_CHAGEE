package com.example.chagee.repository;

import com.example.chagee.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    // Các hàm tìm kiếm voucher có sẵn nếu cần
}
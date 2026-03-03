package com.example.chagee.repository;

import com.example.chagee.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {

    /**
     * ✅ LẤY VOUCHER HIỆN CÓ (Dùng cho Homepage)
     * Đây là hàm mà Service của ông đang gọi và bị báo lỗi "undefined"
     */
    @Query(value = "SELECT * FROM Vouchers WHERE expirydate >= CAST(GETDATE() AS DATE)", nativeQuery = true)
    List<Voucher> getValidVouchers();

    @Query(value = "SELECT v.* FROM Vouchers v " +
       "JOIN UserVouchers uv ON v.vouchercode = uv.vouchercode " +
       "WHERE uv.username = :username AND uv.usage_left > 0 " + // ✅ Điều kiện mới
       "AND v.expirydate >= CAST(GETDATE() AS DATE)", nativeQuery = true)
    List<Voucher> findAvailableVouchersForUser(@Param("username") String username);
}
package com.example.chagee.repository;
import java.time.LocalDate;
import com.example.chagee.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {

    // Query Method: Tìm các voucher có expirydate >= tham số truyền vào
    // Sắp xếp theo ngày hết hạn gần nhất hiện lên trước
    List<Voucher> findByExpirydateGreaterThanEqualOrderByExpirydateAsc(LocalDate date);
}
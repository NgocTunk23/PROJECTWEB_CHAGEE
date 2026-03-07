package com.example.chagee.repository;

import com.example.chagee.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {
    
    // Tìm kiếm user theo username
    Optional<Buyer> findByUsername(String username);

    // ✅ KIỂM TRA TRÙNG USERNAME: Cần thiết vì username là khóa chính
    boolean existsByUsername(String username);

    // ✅ KIỂM TRA TRÙNG PHONENUMBER: Khớp 100% với biến phonenumber trong Entity
    boolean existsByPhonenumber(String phonenumber);

    // ✅ KIỂM TRA TRÙNG EMAIL: Cực kỳ quan trọng vì Entity đang để unique = true
    // Nếu thiếu hàm này để check trước khi lưu, SQL sẽ quăng lỗi 500 khi trùng email
    boolean existsByEmail(String email);
}
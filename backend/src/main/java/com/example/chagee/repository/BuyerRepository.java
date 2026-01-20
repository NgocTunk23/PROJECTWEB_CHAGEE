package com.example.chagee.repository;

import com.example.chagee.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {
    
    // Tìm kiếm Buyer bằng username (dùng cho Login)
    // Trả về Optional để tránh lỗi NullPointerException
    Optional<Buyer> findByUsername(String username);

    // --- DÒNG NÀY SẼ SỬA LỖI CỦA BẠN ---
    // Kiểm tra xem số điện thoại đã tồn tại trong DB chưa (dùng cho Register)
    Boolean existsByPhone(String phone);
    
}
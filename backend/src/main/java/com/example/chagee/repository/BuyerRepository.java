package com.example.chagee.repository;

import com.example.chagee.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {
    
    // Spring tự động map với thuộc tính "username" trong Entity
    Optional<Buyer> findByUsername(String username);

    // ✅ CHÍNH XÁC: "Phonenumber" khớp với thuộc tính "phonenumber" trong Entity
    // Nếu bạn viết "PhoneNumber" (chữ N hoa) sẽ bị lỗi vì Entity không có biến đó.
    boolean existsByPhonenumber(String phonenumber);

}
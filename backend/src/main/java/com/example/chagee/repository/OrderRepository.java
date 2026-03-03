package com.example.chagee.repository;

import com.example.chagee.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    // ✅ Cách 1: Tìm cơ bản (Dễ dùng)
    List<Order> findByBuyerusername(String buyerusername);

    // ✅ Cách 2: Tìm "Xịn" (Khuyên dùng)
    // Câu query này giúp lấy Đơn hàng + Chi tiết món + Thông tin sản phẩm (Tên, Ảnh) 
    // Chỉ trong 1 lần truy vấn duy nhất, giúp React có đủ data để hiển thị.
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.product " +
           "WHERE o.buyerusername = :username " +
           "ORDER BY o.ordertime DESC")
    List<Order> findAllByBuyerusernameWithDetails(@Param("username") String username);
}
package com.example.chagee.repository;

import com.example.chagee.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> { // ✅ Sửa Long thành String
    
    // Tìm đơn hàng theo buyerusername (viết liền)
    List<Order> findByBuyerusername(String buyerusername);
}
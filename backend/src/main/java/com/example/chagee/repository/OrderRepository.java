package com.example.chagee.repository;

import com.example.chagee.entity.Order; // ✅ Sửa dòng này
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
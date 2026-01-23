package com.example.chagee.repository;

import com.example.chagee.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
// Repository cho Entity Product - dùng để tương tác với DATABASE
public interface ProductRepository extends JpaRepository<Product, String> { // Người quản lý cho đối tượng Product với kiểu khóa chính là kiểu string
    // 1. Lấy danh sách category không trùng lặp
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL") // Đây là câu lệnh sql
    List<String> findDistinctCategories();
    
    // 2. Lọc theo category - SELECT * FROM Products WHERE category = 'Trà sữa'
    List<Product> findByCategory(String category);
}
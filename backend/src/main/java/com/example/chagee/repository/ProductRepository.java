package com.example.chagee.repository;

import com.example.chagee.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> { // Khóa chính là String (productid)

    // 1. Lấy danh sách category không trùng lặp
    // Lưu ý: "p.category" ở đây tham chiếu đến thuộc tính "category" trong Entity Product
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();
    
    // 2. Lọc theo category
    // Spring tự động map "Category" -> thuộc tính "category" trong Entity
    List<Product> findByCategory(String category);
}
package com.example.chagee.repository;

import com.example.chagee.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Không cần viết gì thêm ở đây
}
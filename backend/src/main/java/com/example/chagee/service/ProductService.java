package com.example.chagee.service;

import com.example.chagee.entity.Product;
import com.example.chagee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {// 1 bean service dùng để xử lý logic liên quan đến Product
    @Autowired
    private ProductRepository productRepository;

    // Lấy list tên danh mục
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    // Lấy sản phẩm (có thể lọc theo category nếu có tham số)
    public List<Product> getProducts(String category) {
        if (category != null && !category.isEmpty()) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findAll(); // Nếu không chọn gì thì lấy hết
    }
}
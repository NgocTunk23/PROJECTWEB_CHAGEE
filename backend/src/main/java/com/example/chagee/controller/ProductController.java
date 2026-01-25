package com.example.chagee.controller;

import com.example.chagee.entity.Product;
import com.example.chagee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
// SỬA DÒNG NÀY: Thêm "/api" vào trước
@RequestMapping("/api/products") 
public class ProductController {

    @Autowired
    private ProductService productService;

    // API 1: Lấy danh mục
    // URL thực tế sẽ là: http://localhost:8080/api/products/categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    // API 2: Lấy sản phẩm
    // URL thực tế sẽ là: http://localhost:8080/api/products
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.getProducts(category));
    }
}
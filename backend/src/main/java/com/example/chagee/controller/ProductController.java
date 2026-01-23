package com.example.chagee.controller;

import com.example.chagee.entity.Product;
import com.example.chagee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// Nơi nhận yêu cầu từ việc click vào nút trên frontend liên quan đến Product
@RestController
@RequestMapping("/products") // địa chỉ nhà chung của file be http://localhost:8080/products
public class ProductController {
    @Autowired
    private ProductService productService;

    // API 1: Lấy danh sách các nút danh mục
    // GET: http://localhost:8080/api/products/categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    // API 2: Lấy sản phẩm (Có thể lọc)
    // GET: http://localhost:8080/api/products?category=TraSua
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.getProducts(category));
    }
}
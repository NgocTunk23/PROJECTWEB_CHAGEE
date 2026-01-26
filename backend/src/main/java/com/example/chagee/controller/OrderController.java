package com.example.chagee.controller;

import com.example.chagee.dto.OrderRequest;
import com.example.chagee.entity.Order; // ✅ ĐÃ SỬA ĐÚNG IMPORT
import com.example.chagee.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderData) {
        try {
            // 1. Tạo đơn hàng cha (Order)
            Order newOrder = new Order();
            newOrder.setUser_id(orderData.getUser_id());
            newOrder.setTotalPrice(orderData.getTotal_price());
            newOrder.setAddress(orderData.getAddress());
            newOrder.setPhone(orderData.getPhone());

            // 2. Tạo danh sách con (Details)
            if (orderData.getItems() != null) {
                for (OrderRequest.OrderItemRequest itemReq : orderData.getItems()) {
                    
                    // Gọi class con thông qua class cha Order
                    Order.OrderDetail detail = new Order.OrderDetail();
                    
                    detail.setProductId(itemReq.getProduct_id());
                    detail.setQuantity(itemReq.getQuantity());
                    detail.setPrice(itemReq.getPrice());
                    detail.setNote(itemReq.getNote());

                    // Gắn cha cho con
                    detail.setOrder(newOrder); 
                    
                    // Gắn con vào danh sách của cha
                    newOrder.getOrderDetails().add(detail);
                }
            }

            // 3. Lưu xuống Database (Lưu 1 được cả 2)
            Order savedOrder = orderRepository.save(newOrder);

            return ResponseEntity.ok("Đặt hàng thành công! Mã đơn: " + savedOrder.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
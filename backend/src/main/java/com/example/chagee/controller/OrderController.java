package com.example.chagee.controller;

import com.example.chagee.dto.OrderRequest;
import com.example.chagee.entity.Order; 
import com.example.chagee.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderData) {
        System.out.println("🚀 [DEBUG] Nhận yêu cầu tạo đơn cho: " + orderData.getBuyerusername());

        try {
            // 1. Khởi tạo đơn hàng mới
            Order newOrder = new Order();
            
            // ✅ Tạo ID thủ công ORD-XXXX
            String customId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            newOrder.setOrderid(customId);

            // 2. Gán thông tin cơ bản
            newOrder.setBuyerusername(orderData.getBuyerusername());
            newOrder.setOriginalprice(orderData.getOriginalprice());
            newOrder.setVouchercode(orderData.getVouchercode());
            newOrder.setPhonenumber(orderData.getPhonenumber());
            newOrder.setAddress(orderData.getAddress());
            newOrder.setNote(orderData.getNote());
            newOrder.setBranchid(orderData.getBranchid());
            newOrder.setPaymentmethod(orderData.getPaymentmethod());
            newOrder.setOrdertime(new java.util.Date());
            newOrder.setStatusU("Đang xử lý");

            // 3. Xử lý danh sách món ăn
            if (orderData.getItems() != null && !orderData.getItems().isEmpty()) {
                List<Order.OrderDetail> details = new ArrayList<>();
                for (OrderRequest.OrderItemRequest itemReq : orderData.getItems()) {
                    Order.OrderDetail detail = new Order.OrderDetail();
                    detail.setProductid(itemReq.getProductid());
                    detail.setQuantity(itemReq.getQuantity());
                    detail.setPrice(itemReq.getPrice());
                    
                    // ✅ Lấy 3 thông tin quan trọng ông vừa tách trong DTO
                    detail.setSizelevel(itemReq.getSizelevel());
                    detail.setSugarlevel(itemReq.getSugarlevel());
                    detail.setIcelevel(itemReq.getIcelevel());
                    
                    detail.setOrder(newOrder); // Thiết lập mối quan hệ 2 chiều
                    details.add(detail);
                }
                newOrder.setOrderDetails(details);
            } else {
                return ResponseEntity.badRequest().body("Lỗi: Giỏ hàng không có món nào!");
            }

            // 4. Lưu vào Database
            Order savedOrder = orderRepository.save(newOrder);
            System.out.println("✅ [THÀNH CÔNG] Đã lưu đơn hàng: " + savedOrder.getOrderid());

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            System.err.println("❌ [LỖI]: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi Backend: " + e.getMessage());
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getOrdersByUsername(@PathVariable String username) {
        System.out.println("🔍 [DEBUG] Đang lấy lịch sử đơn cho: " + username);
        try {
            // ✅ FIX 4: Dùng hàm Fetch để lấy cả tên món trà sữa (Tránh chữ "Sản phẩm")
            List<Order> orders = orderRepository.findAllByBuyerusernameWithDetails(username);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("❌ [LỖI LẤY ĐƠN]: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }
}
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

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderData) {
        System.out.println("🚀 [DEBUG] Nhận yêu cầu tạo đơn hàng cho: " + orderData.getBuyerusername());

        try {
            Order newOrder = new Order();
            newOrder.setBuyerusername(orderData.getBuyerusername());
            newOrder.setOriginalprice(orderData.getOriginalprice());
            newOrder.setVouchercode(orderData.getVouchercode());
            
            // ✅ FIX 1: Gán SĐT và Địa chỉ từ request gửi lên
            // Đảm bảo OrderRequest.java của ông đã có 2 trường này
            newOrder.setPhonenumber(orderData.getPhonenumber()); 
            newOrder.setAddress(orderData.getAddress());
            
            newOrder.setPaymentmethod(orderData.getPaymentmethod());
            newOrder.setOrdertime(new java.util.Date());
            newOrder.setStatusU("Đang xử lý");

            if (orderData.getItems() != null) {
                List<Order.OrderDetail> details = new ArrayList<>();
                for (OrderRequest.OrderItemRequest itemReq : orderData.getItems()) {
                    Order.OrderDetail detail = new Order.OrderDetail();
                    detail.setProductid(itemReq.getProductid());
                    detail.setQuantity(itemReq.getQuantity());
                    detail.setPrice(itemReq.getPrice());
                    detail.setNote(itemReq.getNote()); // Ghi chú: Size, Sugar, Ice...
                    detail.setOrder(newOrder);
                    details.add(detail);
                }
                newOrder.setOrderDetails(details);
            }

            Order savedOrder = orderRepository.save(newOrder);
            System.out.println("✅ [DEBUG] Đã lưu đơn hàng thành công ID: " + savedOrder.getOrderid());

            return ResponseEntity.ok(savedOrder); // Trả về cả object vừa lưu để frontend update

        } catch (Exception e) {
            System.err.println("❌ [LỖI TẠO ĐƠN]: " + e.getMessage());
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Lỗi Backend: " + e.getMessage());
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getOrdersByUsername(@PathVariable String username) {
        System.out.println("🔍 [DEBUG] Đang lấy lịch sử đơn hàng kèm tên sản phẩm cho: " + username);
        try {
            // ✅ SỬA CHỖ NÀY: Dùng hàm có FETCH để lấy luôn thông tin Product
            // Đổi từ findByBuyerusername -> findAllByBuyerusernameWithDetails
            List<Order> orders = orderRepository.findAllByBuyerusernameWithDetails(username);
            
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("❌ [LỖI LẤY ĐƠN HÀNG]: " + e.getMessage());
            return ResponseEntity.status(500).body("Lỗi Backend: " + e.getMessage());
        }
    }
}
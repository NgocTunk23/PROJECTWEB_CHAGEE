package com.example.chagee.controller;

import com.example.chagee.dto.OrderRequest;
import com.example.chagee.entity.Order; 
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

            // Gán các trường từ Request (Đã đổi tên viết liền không gạch dưới)
            newOrder.setBuyerusername(orderData.getBuyerusername()); 
            newOrder.setOriginalprice(orderData.getOriginalprice());
            newOrder.setPaymentmethod(orderData.getPaymentmethod());
            newOrder.setBranchid(orderData.getBranchid());
            
            // Lưu ý: orderid, ordertime, statusU, taxprice đã có giá trị mặc định trong Entity

            // 2. Tạo danh sách chi tiết đơn hàng (OrderDetails)
            if (orderData.getItems() != null) {
                for (OrderRequest.OrderItemRequest itemReq : orderData.getItems()) {
                    
                    Order.OrderDetail detail = new Order.OrderDetail();
                    
                    // Gán các trường chi tiết (Viết liền khớp SQL)
                    detail.setProductid(itemReq.getProductid());
                    detail.setQuantity(itemReq.getQuantity());
                    detail.setPrice(itemReq.getPrice()); // Đã mở lại vì SQL có cột price
                    detail.setNote(itemReq.getNote());   // Đã mở lại vì SQL có cột note
                    
                    // Gắn liên kết 2 chiều giữa cha và con
                    detail.setOrder(newOrder);
                    newOrder.getOrderDetails().add(detail);
                }
            }

            // 3. Lưu xuống Database (CascadeType.ALL sẽ tự lưu luôn các OrderDetail)
            Order savedOrder = orderRepository.save(newOrder);

            return ResponseEntity.ok("Đặt hàng thành công! Mã đơn: " + savedOrder.getOrderid());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
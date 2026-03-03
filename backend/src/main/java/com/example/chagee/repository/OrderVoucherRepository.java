package com.example.chagee.repository;

// ✅ BỔ SUNG: Import Entity OrderVoucher vào đây
import com.example.chagee.entity.OrderVoucher; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderVoucherRepository extends JpaRepository<OrderVoucher, OrderVoucher.OrderVoucherId> {
}
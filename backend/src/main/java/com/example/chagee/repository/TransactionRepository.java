package com.example.chagee.repository;

import com.example.chagee.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Chú ý: Transaction.Id là kiểu dữ liệu của khóa chính
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Transaction.Id> {
}
package com.example.chagee.repository;

import com.example.chagee.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {
    // Tìm buyer theo username
    Buyer findByUsername(String username);
}
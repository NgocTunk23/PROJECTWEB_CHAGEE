package com.example.chagee.repository;

import com.example.chagee.entity.User; // Đảm bảo import đúng User từ package entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
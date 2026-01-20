// File: backend/src/main/java/com/example/chagee/repository/AdminRepository.java
package com.example.chagee.repository;

import com.example.chagee.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
}
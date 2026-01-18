package com.example.chagee.repository;

import com.example.chagee.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    List<Branch> findByAddressContaining(String district);
}
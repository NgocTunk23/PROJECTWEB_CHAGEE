package com.example.chagee.controller;

import com.example.chagee.entity.Branch;
import com.example.chagee.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "http://localhost:3000") // Hoặc port frontend của bạn
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    // API lấy tất cả danh sách cửa hàng
    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }
    
    // API tìm kiếm theo địa chỉ (quận/huyện)
    @GetMapping("/search")
    public List<Branch> searchBranches(@RequestParam String query) {
        return branchRepository.findByAddressContaining(query);
    }
}
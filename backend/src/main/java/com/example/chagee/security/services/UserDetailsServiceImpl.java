package com.example.chagee.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chagee.entity.Admin;
import com.example.chagee.entity.Buyer;
import com.example.chagee.repository.AdminRepository;
import com.example.chagee.repository.BuyerRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    BuyerRepository buyerRepository;

    @Autowired
    AdminRepository adminRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Tìm trong bảng Buyers trước
        if (username == null) {
            throw new UsernameNotFoundException("Username is null");
        }
        Buyer buyer = buyerRepository.findById(username).orElse(null);
        if (buyer != null) {
            return UserDetailsImpl.build(buyer);
        }

        // 2. Nếu không thấy, tìm tiếp trong bảng Admins
        Admin admin = adminRepository.findById(username).orElse(null);
        if (admin != null) {
            return UserDetailsImpl.build(admin);
        }

        // 3. Nếu tìm cả 2 bảng đều không thấy -> Lỗi
        throw new UsernameNotFoundException("User Not Found with username: " + username);
    }
}
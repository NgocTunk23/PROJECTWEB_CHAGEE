package com.example.chagee.security.services;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.chagee.entity.Admin;
import com.example.chagee.entity.Buyer;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private int rewardPoints; // <--- Thêm biến này

    // Cập nhật Constructor
    public UserDetailsImpl(String username, String email, String password, int rewardPoints,
            Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.rewardPoints = rewardPoints; // <--- Gán giá trị
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Buyer buyer) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

        return new UserDetailsImpl(
                buyer.getUsername(),
                buyer.getEmail(),
                buyer.getPassword(),
                buyer.getRewardPoints() != null ? buyer.getRewardPoints() : 0, // <--- Lấy điểm từ Buyer
                authorities);
    }

    // Cập nhật hàm build() cho Admin (Admin không có điểm nên để 0)
    public static UserDetailsImpl build(Admin admin) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return new UserDetailsImpl(
                admin.getUsername(),
                admin.getEmail(),
                admin.getPassword(),
                0, // <--- Admin 0 điểm
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public int getRewardPoints() {
        return rewardPoints;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(username, user.username);
    }
}
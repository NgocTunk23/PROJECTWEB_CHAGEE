package com.example.chagee.security;

import com.example.chagee.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    // Inject Service xử lý logic tìm kiếm User (Admin/Buyer)
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    // Filter xử lý Token JWT
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // --- CẤU HÌNH PASSWORD ENCODER ---
    // Đang dùng NoOp (Không mã hóa) cho môi trường Dev
    @SuppressWarnings("deprecation")
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    // --- CẤU HÌNH AUTHENTICATION PROVIDER (QUAN TRỌNG) ---
    // Hàm này kết nối UserDetailsService của bạn với Spring Security
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        // Báo cho Spring biết dùng userDetailsService tùy chỉnh (tìm 2 bảng)
        authProvider.setUserDetailsService(userDetailsService);
        // Báo cho Spring biết cách so khớp mật khẩu
        authProvider.setPasswordEncoder(passwordEncoder()); // dùng passwordEncoder() đã khai báo ở trên
        
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // --- CẤU HÌNH SECURITY FILTER CHAIN ---
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình CORS và tắt CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Tắt CSRF vì dùng JWT

            // 2. Quản lý Session: Stateless (Không lưu session)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. Phân quyền truy cập (Authorize Requests)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()      // Cho phép Login/Register
                .requestMatchers("/api/products/**").permitAll()  // Cho phép xem sản phẩm
                .requestMatchers("/api/stores/**").permitAll()    // Cho phép xem cửa hàng
                .requestMatchers("/error").permitAll()            // Cho phép xem trang lỗi (tránh lỗi 403 oan)
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN") // Chỉ Admin mới vào được
                .requestMatchers("/api/branches/**").permitAll()
                .anyRequest().authenticated()                     // Các link còn lại phải đăng nhập
            );

        // 4. Thêm Provider đã cấu hình ở trên
        http.authenticationProvider(authenticationProvider());

        // 5. Thêm Filter kiểm tra Token trước khi xác thực user
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- CẤU HÌNH CORS (CHO PHÉP REACT GỌI API) ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép tất cả các nguồn (React localhost:3000, 5173...)
        configuration.setAllowedOriginPatterns(List.of("*")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
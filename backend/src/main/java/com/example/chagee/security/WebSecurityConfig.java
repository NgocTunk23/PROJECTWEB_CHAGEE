package com.example.chagee.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder; // Import quan trọng để tắt mã hóa
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // --- SỬA ĐỔI QUAN TRỌNG: TẮT MÃ HÓA PASSWORD ---
    // Dùng NoOpPasswordEncoder để so sánh chuỗi thô (VD: "123456" so với "123456")
    // Lưu ý: Chỉ dùng cho môi trường Dev/Học tập.
    @SuppressWarnings("deprecation")
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // --- CẤU HÌNH BẢO MẬT CHÍNH ---
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Kích hoạt CORS và tắt CSRF (Bắt buộc cho JWT)
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            
            // 2. Quản lý Session: Không lưu trạng thái (Stateless)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Phân quyền đường dẫn (Authorize Requests)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()      // Cho phép Login/Register thoải mái
                .requestMatchers("/api/products/**").permitAll()  // Cho phép xem sản phẩm không cần login
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Chỉ Admin mới vào được
                .anyRequest().authenticated()                     // Các link còn lại phải có Token
            );

        // 4. Thêm Filter kiểm tra Token trước khi xác thực user
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- CẤU HÌNH CORS (GOD MODE) ---
    // Cho phép mọi nguồn (Frontend 3000, 3001...) đều kết nối được
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        // Dùng Pattern "*" để chấp nhận tất cả các cổng localhost
        config.setAllowedOriginPatterns(Arrays.asList("*")); 
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
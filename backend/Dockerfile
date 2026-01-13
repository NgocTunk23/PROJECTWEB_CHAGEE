# 1. Dùng một môi trường Java 21 chuẩn để chạy
FROM eclipse-temurin:21-jdk-alpine

# 2. Tạo thư mục làm việc trong Docker
WORKDIR /app

# 3. Copy toàn bộ code từ máy cậu vào trong Docker
COPY . .

# 4. Cấp quyền chạy cho file mvnw (quan trọng cho Linux/Docker)
RUN chmod +x mvnw

# 5. Lệnh chạy mặc định khi bật container lên
# Nó sẽ tự tải thư viện và chạy Spring Boot
CMD ["./mvnw", "spring-boot:run"]
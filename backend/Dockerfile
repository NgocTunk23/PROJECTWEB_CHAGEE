# --- Giai đoạn 1: Build bằng Image Maven chuẩn ---
# Dùng image có sẵn Maven và Java 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# 1. Chỉ copy file pom.xml trước
COPY pom.xml .

# 2. Tải toàn bộ thư viện về (Lớp này sẽ được Cache)
# Lệnh này tương đương với ./mvnw dependency:go-offline nhưng dùng maven của Docker
RUN mvn dependency:go-offline

# 3. Copy code nguồn vào
COPY src ./src

# 4. Build ra file .jar
RUN mvn clean package -DskipTests

# --- Giai đoạn 2: Run (Dùng JRE nhẹ) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 5. Copy file .jar từ giai đoạn Build sang
COPY --from=build /app/target/*.jar app.jar

# 6. Mở port
EXPOSE 8080

# 7. Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
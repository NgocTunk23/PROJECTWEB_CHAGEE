# 🍵 Dự án Web App Chagee Order (Demo)

## 📖 1. Tổng quan dự án
Đây là dự án mô phỏng ứng dụng web đặt đồ uống của thương hiệu Chagee. Hệ thống cung cấp trải nghiệm mua sắm mượt mà cho khách hàng (xem menu, tùy chỉnh đồ uống, giỏ hàng, áp dụng mã giảm giá, thanh toán) và hệ thống quản lý dữ liệu toàn diện ở phía backend.

Dự án được xây dựng theo kiến trúc Client-Server với RESTful API, ứng dụng Containerization (Docker) để đồng bộ môi trường phát triển và dễ dàng triển khai.

## 🚀 2. Công nghệ sử dụng (Tech Stack)
* **Frontend:** ReactJS, TypeScript, Tailwind CSS.
* **Backend:** Java, Spring Boot.
* **Cơ sở dữ liệu:** Microsoft SQL Server.
* **Xác thực & Phân quyền:** JSON Web Token (JWT).
* **Triển khai & Vận hành:** Docker.

## ✨ 3. Tính năng nổi bật
* **Hệ thống người dùng:** Đăng nhập/Đăng ký an toàn với mã hóa mật khẩu và phân quyền (Admin, Buyer, Branch) thông qua JWT.
* **Mua sắm đồ uống:** Xem danh mục, chi tiết sản phẩm, tùy chỉnh kích cỡ và quản lý giỏ hàng.
* **Thanh toán & Đơn hàng:** Xử lý thanh toán, áp dụng Voucher giảm giá và theo dõi trạng thái đơn hàng.
* **Định tuyến chi nhánh:** Lựa chọn cửa hàng/chi nhánh (Store Selector) để đặt hàng.

---

## ⚙️ 4. Hướng dẫn Cài đặt & Khởi chạy (Dành cho Developer)

### 4.1. Khởi chạy toàn bộ hệ thống bằng Docker
Môi trường Docker đã bao gồm SQL Server, Backend và Frontend.
* **Build image và khởi chạy:**
    ```bash
    docker compose up --build
    ```
* **Khởi chạy bình thường và xem log:**
    ```bash
    docker compose up
    ```
* **Tắt Docker và xóa các volume đi kèm:**
    ```bash
    docker compose down -v
    ```

### 4.2. Quản lý Cơ sở dữ liệu (Database)
Khởi tạo cấu trúc bảng và dữ liệu mẫu (`init_db.sql`) vào SQL Server. Chạy lệnh sau trong terminal mới khi container đang hoạt động:

* **Trên Windows (WSL):**
    ```bash
    docker exec -i sql_container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password123!" -C -f 65001 < ./database/init_db.sql
    ```
* **Trên macOS:**
    ```bash
    docker exec -i sql_container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Password123!' -C < ./database/init_db.sql
    ```

### 4.3. Chạy độc lập ở môi trường Local (Không dùng Docker)
Nếu bạn muốn debug trực tiếp trên máy:

* **Chạy Backend (Spring Boot):**
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
    *Lưu ý: Nếu dùng Docker cho DB, Backend vẫn có thể kết nối bình thường qua localhost.*

* **Chạy Frontend (ReactJS):**
    ```bash
    cd frontend
    npm install
    npm start
    ```
    *Web sẽ được mở tại:* [http://localhost:3001/](http://localhost:3001/) 

## 📦 5. Quản lý mã nguồn (Version Control)

* **Lưu thay đổi và đẩy mã nguồn lên Git:**
    ```bash
    git add .
    git status
    git commit -m "Cập nhật tính năng/Sửa lỗi..."
    git push origin main
    ```
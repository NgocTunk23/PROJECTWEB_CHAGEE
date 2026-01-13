-- 1. Tạo bảng (Nếu cậu chưa có bảng nào)
-- Nếu bảng đã có rồi thì bỏ qua đoạn này
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1), -- Tự động tăng số thứ tự
    full_name NVARCHAR(100),          -- Tên (cho phép tiếng Việt)
    email VARCHAR(100),
    password VARCHAR(50)
);

-- 2. Thêm dữ liệu (Đây là phần cậu muốn làm)
INSERT INTO Users (full_name, email, password)
VALUES (N'Nguyễn Hiếu', 'hieu@gmail.com', '123456');

INSERT INTO Users (full_name, email, password)
VALUES (N'Admin Dep Trai', 'admin@chagee.com', 'admin123');

-- 3. Xem lại kết quả xem đã vào chưa
SELECT * FROM Users;
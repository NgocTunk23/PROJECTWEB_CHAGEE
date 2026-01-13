-- Chuyển về database hệ thống trước để thực hiện lệnh tạo/xóa
USE master;
GO

-- Kiểm tra nếu database đã tồn tại thì đóng kết nối và xóa nó đi
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'ChageeDB')
BEGIN
    ALTER DATABASE ChageeDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ChageeDB;
END
GO

-- 1. Tạo mới Database
CREATE DATABASE ChageeDB;
GO

-- 2. Đợi một chút để hệ thống nhận diện (Lệnh này cực kỳ quan trọng)
USE ChageeDB;
GO

-- Kiểm tra nếu bảng đã tồn tại thì xóa đi để tạo mới (tránh lỗi trùng tên)
IF OBJECT_ID('Products', 'U') IS NOT NULL
    DROP TABLE Products;
GO

-- 3. Giờ mới tạo bảng
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    description NVARCHAR(255)
);
GO

-- 4. Thêm dữ liệu mẫu
INSERT INTO Products (name, price, description)
VALUES (N'Trà sữa Chagee', 55000, N'Vị đậm đà');
GO

USE ChageeDB;
GO

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName NVARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER'
);
GO

-- Thêm một tài khoản admin mẫu
INSERT INTO Users (username, password, fullName, role)
VALUES ('admin', '123456', N'Quản Trị Viên', 'ADMIN');
GO
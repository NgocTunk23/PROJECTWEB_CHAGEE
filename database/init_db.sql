USE master;
GO

-- Sửa tên thành chagee_db cho khớp với Docker Compose
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'chagee_db')
BEGIN
    ALTER DATABASE chagee_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE chagee_db;
END
GO

CREATE DATABASE chagee_db;
GO

USE chagee_db;
GO

IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
GO

CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    description NVARCHAR(255)
);
GO

INSERT INTO Products (name, price, description)
VALUES (N'Trà sữa Chagee', 55000, N'Vị đậm đà');
GO

IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
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

INSERT INTO Users (username, password, fullName, role)
VALUES ('admin', '123456', N'Quản Trị Viên', 'ADMIN');
GO
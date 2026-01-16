USE master;
GO

--! 1. TẠO DATABASE nhưng chỉ tạo khi và chỉ khi mới bắt đầu test, sài lâu là p bỏ không là mất data
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'chagee_db')
BEGIN
    ALTER DATABASE chagee_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE chagee_db;
END
GO
--------------!
CREATE DATABASE chagee_db;
GO

USE chagee_db;
GO

-- =============================================
-- 1. BẢNG QUẢN TRỊ VIÊN
-- =============================================
CREATE TABLE Admins (
    username VARCHAR(50) PRIMARY KEY,--
    passwordU VARCHAR(255) NOT NULL,--\
    email VARCHAR(100) UNIQUE,--
    phone VARCHAR(20),--
    created_at DATETIME DEFAULT GETDATE(),--
    full_name NVARCHAR(100),--
    dob DATE,
    avatar_link VARCHAR(MAX),
    gender NVARCHAR(10),

    permission_level INT DEFAULT 1, -- Cấp độ quyền (VD: 1= QUẢN LÝ CHI NHÁNH, 10= CHỦ SỞ HỮU)--
    last_login DATETIME--
);
GO

-- =============================================
-- 2. BẢNG NGƯỜI MUA
-- =============================================
CREATE TABLE Buyers (
    username VARCHAR(50) PRIMARY KEY,--
    passwordU VARCHAR(255) NOT NULL,--
    email VARCHAR(100) UNIQUE,--
    phone VARCHAR(20),--
    created_at DATETIME DEFAULT GETDATE(),--
    full_name NVARCHAR(100),--
    dob DATE,
    avatar_link VARCHAR(MAX),
    gender NVARCHAR(10),

    reward_points INT DEFAULT 0, -- Điểm thưởng
    loyalty_code VARCHAR(50) UNIQUE, -- Mã tích điểm
    membership_tier NVARCHAR(50) DEFAULT 'Member' -- Hạng thành viên
);
GO

-- =============================================
-- 3. CÁC BẢNG LIÊN KẾT CỦA NGƯỜI MUA
-- =============================================

-- Liên kết MXH (Chỉ dành cho Buyer)
CREATE TABLE SocialAccounts (
    buyer_username VARCHAR(50),
    provider_name VARCHAR(20), -- 'GOOGLE', 'APPLE'
    provider_id VARCHAR(255) UNIQUE,
    PRIMARY KEY (buyer_username, provider_name, provider_id),
    FOREIGN KEY (buyer_username) REFERENCES Buyers(username) ON DELETE CASCADE
);
GO

-- Tài khoản ngân hàng (Chỉ dành cho Buyer)
CREATE TABLE BuyerBankAccounts (
    buyer_username VARCHAR(50),
    bank_name NVARCHAR(100),
    account_number VARCHAR(50),
    card_type NVARCHAR(50),
    PRIMARY KEY (buyer_username, bank_name, account_number),
    FOREIGN KEY (buyer_username) REFERENCES Buyers(username) ON DELETE CASCADE
);
GO

-- Lịch sử Khóa tài khoản (Admin khóa Buyer)
CREATE TABLE AccountBans (
    admin_username VARCHAR(50), -- Khóa ngoại trỏ về Admins
    buyer_username VARCHAR(50), -- Khóa ngoại trỏ về Buyers
    ban_time DATETIME DEFAULT GETDATE(),
    reason NVARCHAR(255),
    PRIMARY KEY (admin_username, buyer_username),
    FOREIGN KEY (admin_username) REFERENCES Admins(username),
    FOREIGN KEY (buyer_username) REFERENCES Buyers(username)
);
GO

-- =============================================
-- 4. BẢNG SẢN PHẨM VÀ CHI NHÁNH
-- =============================================

CREATE TABLE Branches (
    branch_id VARCHAR(50) PRIMARY KEY,
    addressU NVARCHAR(255) NOT NULL,
    manager_username VARCHAR(50), -- Người quản lý là Admin
    FOREIGN KEY (manager_username) REFERENCES Admins(username)
);
GO

CREATE TABLE Products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name NVARCHAR(100) NOT NULL,
    product_image VARCHAR(MAX),
    display_price DECIMAL(18, 2) NOT NULL,
    category NVARCHAR(50),
    descriptionU NVARCHAR(MAX),
    sold_quantity INT DEFAULT 0, --! SỐ LƯỢNG ĐÃ BÁN
    approved_by VARCHAR(50), -- Người duyệt là Admin
    FOREIGN KEY (approved_by) REFERENCES Admins(username)
);
GO

-- =============================================
-- 5. KHUYẾN MÃI (VOUCHER)
-- =============================================

CREATE TABLE Vouchers (
    voucher_code VARCHAR(50) PRIMARY KEY,
    voucher_name NVARCHAR(100),
    discount_amount DECIMAL(18, 2),
    discount_percentage INT,
    max_discount DECIMAL(18, 2),
    min_order_value DECIMAL(18, 2),
    created_by VARCHAR(50), -- Người tạo là Admin
    FOREIGN KEY (created_by) REFERENCES Admins(username)
);
GO

-- =============================================
-- 6. ĐƠN HÀNG VÀ GIAO DỊCH
-- =============================================

CREATE TABLE Orders (
    order_id VARCHAR(50) PRIMARY KEY,
    
    payment_method NVARCHAR(50),
    original_price DECIMAL(18, 2),
    tax_price DECIMAL(18, 2) DEFAULT 0,

    
    statusU NVARCHAR(50) DEFAULT N'Pending',
    order_time DATETIME DEFAULT GETDATE(),
    payment_time DATETIME,
    completion_time DATETIME,

    buyer_username VARCHAR(50), -- Người mua
    branch_id VARCHAR(50),

    FOREIGN KEY (buyer_username) REFERENCES Buyers(username), -- Chỉ liên kết với Buyers
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);
GO


CREATE TABLE OrderVouchers (
    order_id VARCHAR(50),
    voucher_code VARCHAR(50),
    PRIMARY KEY (order_id, voucher_code),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (voucher_code) REFERENCES Vouchers(voucher_code)
);
GO

CREATE TABLE Transactions (
    transaction_id VARCHAR(50),
    order_id VARCHAR(50),
    buyer_username VARCHAR(50), -- Người thực hiện giao dịch là Buyer
    amount DECIMAL(18, 2),
    transaction_time DATETIME DEFAULT GETDATE(),
    payment_gateway NVARCHAR(50),
    bank_name NVARCHAR(100),

    PRIMARY KEY (transaction_id, order_id, buyer_username),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (buyer_username) REFERENCES Buyers(username)
);
GO

USE chagee_db;
GO

-- =============================================
-- 7. BẢNG MẶT HÀNG ÁP DỤNG MÃ
-- =============================================
-- Bảng này cho phép 1 voucher áp dụng cho nhiều món/danh mục cụ thể
IF OBJECT_ID('VoucherAppliedItems', 'U') IS NOT NULL DROP TABLE VoucherAppliedItems;

CREATE TABLE VoucherAppliedItems (
    voucher_code VARCHAR(50),
    applicable_object NVARCHAR(100), -- Tên món hoặc danh mục được áp dụng (VD: 'Trà sữa', 'Size L')
    
    PRIMARY KEY (voucher_code, applicable_object), -- Khóa chính phức hợp để tránh trùng lặp
    FOREIGN KEY (voucher_code) REFERENCES Vouchers(voucher_code) ON DELETE CASCADE
);
GO

-- =============================================
-- 8. BẢNG CHI TIẾT ĐƠN HÀNG - "CHỨA" 
-- =============================================
-- Bảng này liên kết Mã đơn hàng và Mã SP
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;

CREATE TABLE OrderDetails (
    order_id VARCHAR(50),
    product_id VARCHAR(50),
    
    -- Các thuộc tính bổ sung thường có trong bảng này (tùy chọn)
    quantity INT DEFAULT 1,         -- Số lượng
    
    PRIMARY KEY (order_id, product_id), -- Khóa chính là sự kết hợp giữa Mã Đơn và Mã SP
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
GO


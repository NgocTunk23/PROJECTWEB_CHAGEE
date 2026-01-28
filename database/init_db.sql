USE master;
GO

-- 1. Xóa Database nếu tồn tại (Kèm ngắt kết nối)
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

-- =============================================
-- XÓA BẢNG CŨ (THEO THỨ TỰ CON TRƯỚC -> CHA SAU)
-- =============================================
-- Nhóm giao dịch & Đơn hàng (Xóa trước vì phụ thuộc nhiều nơi)
IF OBJECT_ID('Transactions', 'U') IS NOT NULL DROP TABLE Transactions;
IF OBJECT_ID('OrderVouchers', 'U') IS NOT NULL DROP TABLE OrderVouchers;
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;

-- Nhóm Voucher & Sản phẩm
IF OBJECT_ID('VoucherAppliedItems', 'U') IS NOT NULL DROP TABLE VoucherAppliedItems;
IF OBJECT_ID('Vouchers', 'U') IS NOT NULL DROP TABLE Vouchers;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Branches', 'U') IS NOT NULL DROP TABLE Branches;

-- Nhóm Người dùng & Tài khoản
IF OBJECT_ID('AccountBans', 'U') IS NOT NULL DROP TABLE AccountBans;
IF OBJECT_ID('SocialAccounts', 'U') IS NOT NULL DROP TABLE SocialAccounts;
IF OBJECT_ID('BuyerBankAccounts', 'U') IS NOT NULL DROP TABLE BuyerBankAccounts;

-- Cuối cùng mới xóa 2 bảng gốc (Cha)
IF OBJECT_ID('Buyers', 'U') IS NOT NULL DROP TABLE Buyers;
IF OBJECT_ID('Admins', 'U') IS NOT NULL DROP TABLE Admins;
GO

-- =============================================
-- 1. BẢNG QUẢN TRỊ VIÊN
-- =============================================
IF OBJECT_ID('Admins', 'U') IS NOT NULL DROP TABLE Admins;
CREATE TABLE Admins (
    username VARCHAR(255) PRIMARY KEY,--

    passwordU VARCHAR(255) NOT NULL,--

    email VARCHAR(100) UNIQUE,--

    fullname NVARCHAR(100),--

    phonenumber VARCHAR(20),--

    createdat DATETIME DEFAULT GETDATE(),--

    dob DATE,

    avatarlink VARCHAR(MAX),

    gender NVARCHAR(10),

    permissionlevel INT DEFAULT 1, -- Cấp độ quyền (VD: 1= QUẢN LÝ CHI NHÁNH, 10= CHỦ SỞ HỮU)--

    lastlogin DATETIME--
);
GO

-- =============================================
-- 2. BẢNG NGƯỜI MUA
-- =============================================
IF OBJECT_ID('Buyers', 'U') IS NOT NULL DROP TABLE Buyers;
CREATE TABLE Buyers (
    username VARCHAR(255) PRIMARY KEY,--
    passwordU VARCHAR(255) NOT NULL,--
    email VARCHAR(100) UNIQUE,--
    phonenumber VARCHAR(20),--
    createdat DATETIME DEFAULT GETDATE(),--
    fullname NVARCHAR(100),--
    dob DATE,
    avatarlink VARCHAR(MAX),
    gender NVARCHAR(10),
    permissionlevel INT DEFAULT 0, -- Cấp độ quyền (0= NGƯỜI MUA THƯỜNG)--
    rewardpoints INT DEFAULT 0, -- Điểm thưởng
    loyaltycode VARCHAR(255), -- Mã tích điểm
    membershiptier NVARCHAR(255) DEFAULT 'Member' -- Hạng thành viên
);
GO

-- =============================================
-- 3. CÁC BẢNG LIÊN KẾT CỦA NGƯỜI MUA
-- =============================================

-- Liên kết MXH (Chỉ dành cho Buyer)
IF OBJECT_ID('SocialAccounts', 'U') IS NOT NULL DROP TABLE SocialAccounts;
CREATE TABLE SocialAccounts (
    buyerusername VARCHAR(255),
    providername VARCHAR(20), -- 'GOOGLE', 'APPLE'
    providerid VARCHAR(255) UNIQUE,
    PRIMARY KEY (buyerusername, providername, providerid),
    FOREIGN KEY (buyerusername) REFERENCES Buyers(username) ON DELETE CASCADE
);
GO

-- Tài khoản ngân hàng (Chỉ dành cho Buyer)
IF OBJECT_ID('BuyerBankAccounts', 'U') IS NOT NULL DROP TABLE BuyerBankAccounts;
CREATE TABLE BuyerBankAccounts (
    buyerusername VARCHAR(255),
    bankname NVARCHAR(255),
    accountnumber VARCHAR(255),
    cardtype NVARCHAR(255),
    PRIMARY KEY (buyerusername, bankname, accountnumber),
    FOREIGN KEY (buyerusername) REFERENCES Buyers(username) ON DELETE CASCADE
);
GO

-- Lịch sử Khóa tài khoản (Admin khóa Buyer)
IF OBJECT_ID('AccountBans', 'U') IS NOT NULL DROP TABLE AccountBans;
CREATE TABLE AccountBans (
    adminusername VARCHAR(255), -- Khóa ngoại trỏ về Admins
    buyerusername VARCHAR(255), -- Khóa ngoại trỏ về Buyers
    bantime DATETIME DEFAULT GETDATE(),
    reason NVARCHAR(255),
    PRIMARY KEY (adminusername, buyerusername),
    FOREIGN KEY (adminusername) REFERENCES Admins(username),
    FOREIGN KEY (buyerusername) REFERENCES Buyers(username)
);
GO

-- =============================================
-- 4. BẢNG SẢN PHẨM VÀ CHI NHÁNH
-- =============================================
IF OBJECT_ID('Branches', 'U') IS NOT NULL DROP TABLE Branches;
CREATE TABLE Branches (
    branchid VARCHAR(255) PRIMARY KEY,
    addressU NVARCHAR(255) NOT NULL,
    managerusername VARCHAR(255), -- Người quản lý là Admin
    FOREIGN KEY (managerusername) REFERENCES Admins(username)
);
GO

IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
CREATE TABLE Products (
    productid VARCHAR(255) PRIMARY KEY,
    productname NVARCHAR(100) NOT NULL,
    productimage VARCHAR(MAX),
    displayprice DECIMAL(18, 2) NOT NULL,
    category NVARCHAR(255),
    descriptionU NVARCHAR(MAX),
    soldquantity INT DEFAULT 0, --! SỐ LƯỢNG ĐÃ BÁN
    approvedby VARCHAR(255), -- Người duyệt là Admin
    FOREIGN KEY (approvedby) REFERENCES Admins(username)
);
GO

-- =============================================
-- 5. KHUYẾN MÃI (VOUCHER)
-- =============================================
IF OBJECT_ID('Vouchers', 'U') IS NOT NULL DROP TABLE Vouchers;
CREATE TABLE Vouchers (
    vouchercode VARCHAR(255) PRIMARY KEY,
    vouchername NVARCHAR(100),
    discountamount DECIMAL(18, 2),
    discountpercentage INT,
    maxdiscount DECIMAL(18, 2),
    minordervalue DECIMAL(18, 2),
    createdby VARCHAR(255), -- Người tạo là Admin
    FOREIGN KEY (createdby) REFERENCES Admins(username)
);
GO

-- =============================================
-- 6. ĐƠN HÀNG VÀ GIAO DỊCH
-- =============================================
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
CREATE TABLE Orders (
    orderid VARCHAR(255) PRIMARY KEY,
    
    paymentmethod NVARCHAR(255),
    originalprice DECIMAL(18, 2),
    taxprice DECIMAL(18, 2) DEFAULT 0,

    
    statusU NVARCHAR(255) DEFAULT N'Pending',
    ordertime DATETIME DEFAULT GETDATE(),
    paymenttime DATETIME,
    completiontime DATETIME,

    buyerusername VARCHAR(255), -- Người mua
    branchid VARCHAR(255),

    FOREIGN KEY (buyerusername) REFERENCES Buyers(username), -- Chỉ liên kết với Buyers
    FOREIGN KEY (branchid) REFERENCES Branches(branchid)
);
GO

IF OBJECT_ID('OrderVouchers', 'U') IS NOT NULL DROP TABLE OrderVouchers;
CREATE TABLE OrderVouchers (
    orderid VARCHAR(255),
    vouchercode VARCHAR(255),
    PRIMARY KEY (orderid, vouchercode),
    FOREIGN KEY (orderid) REFERENCES Orders(orderid),
    FOREIGN KEY (vouchercode) REFERENCES Vouchers(vouchercode)
);
GO
IF OBJECT_ID('Transactions', 'U') IS NOT NULL DROP TABLE Transactions;
CREATE TABLE Transactions (
    transactionid VARCHAR(255),
    orderid VARCHAR(255),
    buyerusername VARCHAR(255), -- Người thực hiện giao dịch là Buyer
    amount DECIMAL(18, 2),
    transactiontime DATETIME DEFAULT GETDATE(),
    paymentgateway NVARCHAR(255),
    bankname NVARCHAR(255),

    PRIMARY KEY (transactionid, orderid, buyerusername),
    FOREIGN KEY (orderid) REFERENCES Orders(orderid),
    FOREIGN KEY (buyerusername) REFERENCES Buyers(username)
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
    vouchercode VARCHAR(255),
    applicableobject NVARCHAR(100), -- Tên món hoặc danh mục được áp dụng (VD: 'Trà sữa', 'Size L')
    
    PRIMARY KEY (vouchercode, applicableobject), -- Khóa chính phức hợp để tránh trùng lặp
    FOREIGN KEY (vouchercode) REFERENCES Vouchers(vouchercode) ON DELETE CASCADE
);
GO

-- =============================================
-- 8. BẢNG CHI TIẾT ĐƠN HÀNG - "CHỨA"
-- =============================================
-- Bảng này liên kết Mã đơn hàng và Mã SP
-- =============================================
-- 8. BẢNG CHI TIẾT ĐƠN HÀNG (ĐÃ SỬA: THÊM CỘT ID)
-- =============================================
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;

CREATE TABLE OrderDetails (
    -- ✅ THÊM DÒNG NÀY: Cột id tự tăng để khớp với biến "Long id" trong Java
    id BIGINT IDENTITY(1,1) PRIMARY KEY, 
    
    orderid VARCHAR(255),
    productid VARCHAR(255),
    
    quantity INT DEFAULT 1,
    
    price DECIMAL(18, 2), -- (Tùy chọn: Thêm để lưu giá lúc mua)
    note NVARCHAR(MAX),   -- (Tùy chọn: Thêm ghi chú)
    
    -- Khóa ngoại
    FOREIGN KEY (orderid) REFERENCES Orders(orderid) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES Products(productid)
);
GO

-- =============================================
-- DATA
-- =============================================

USE chagee_db;
GO

-- =============================================
-- 1. ADMIN
-- =============================================
INSERT INTO Admins (
    username, passwordU, email, phonenumber, fullname, permissionlevel
) VALUES
('manager01', '123456789', 'manager01@chagee.com', '0909000001', N'Nguyễn Ngọc Tôn', 10),
('manager02', '123456789', 'manager02@chagee.com', '0909000002', N'Phan Ngọc Quỳnh Trang', 10);
GO

-- =============================================
-- 2. BUYERS
-- =============================================
INSERT INTO Buyers (
    username, passwordU, email, phonenumber, fullname, rewardpoints, membershiptier, avatarlink
) VALUES
('member01', '123456789', 'member01@gmail.com', '0911000002', N'Nguyễn Văn An', 120, N'Silver', 'images/user_avts/avt_member01.jpeg'),
('member02', '123456789', 'member02@gmail.com', '0911000002', N'Trần Nhi', 300, N'Gold', 'images/user_avts/avt_member02.jpeg');
GO

-- =============================================
-- 3. CHI NHÁNH (***FIXED***)
-- =============================================
-- Removed 'branchname' from the column list to match the VALUES and Table Definition
INSERT INTO Branches (
    branchid, addressU, managerusername
) VALUES
('CHAGEE_LBB',  N'462 Lũy Bán Bích, Phường Tân Phú, TP. HCM',                                   'manager01'),
('CHAGEE_TSN',  N'369A Tân Sơn Nhì, Phường Phú Thọ Hoà, TP. HCM',                               'manager01'),
('CHAGEE_NTB',  N'162 Nguyễn Thái Bình, Phường Nguyễn Thái Bình, TP. HCM',                      'manager01'),
('CHAGEE_MPL',  N'GF02, Tầng Trệt mPlaza, 39 Lê Duẩn, Phường Sài Gòn, TP. HCM',                 'manager01'),
('CHAGEE_VGP',  N'101.S05 Vinhomes Grand Park, 88 Phước Thiên, Long Bình, TP. HCM',             'manager01'),
('CHAGEE_BC',   N'133-135 Bàu Cát, Phường Tân Bình, TP. HCM',                                   'manager01'),
('CHAGEE_PQ',   N'119G-119H Phổ Quang, Phường Đức Nhuận, TP. HCM',                              'manager01'),
('CHAGEE_HG',   N'584-586-588 Hậu Giang, Phường Phú Lâm, TP. HCM',                              'manager01'),
('CHAGEE_NGT',  N'116 Nguyễn Gia Trí, Phường Bình Thạnh, TP. HCM',                              'manager01'),
('CHAGEE_VHM',  N'Tầng 1, Vị trí 1-20 Vạn Hạnh Mall, 11 Sư Vạn Hạnh, Phường Hòa Hưng, TP. HCM', 'manager01'),
('CHAGEE_VCP',  N'Vinhomes Central Park C1.SH06, Điện Biên Phủ, Bình Thạnh, TP. HCM',           'manager01'),
('CHAGEE_CAT',  N'Catavil An Phú, 01 Đường Song Hành, Phường Bình Trưng, TP. HCM',              'manager01'),
('CHAGEE_NT',   N'440 Nguyễn Trãi, Phường An Đông, TP. Hồ Chí Minh',                            'manager01'),
('CHAGEE_LTT',  N'200A Lý Tự Trọng, Phường Bến Thành, TP. HCM',                                 'manager01'),
('CHAGEE_LVS',  N'236A Lê Văn Sỹ, Phường Tân Sơn Hoà, TP. HCM',                                 'manager01'),
('CHAGEE_LHP',  N'178-180 Lê Hồng Phong, Phường Chợ Quán, TP. HCM',                             'manager01'),
('CHAGEE_PXL',  N'181 Phan Xích Long, Phường Cầu Kiệu, TP. HCM',                                'manager01'),
('CHAGEE_CMT8', N'66B Cách Mạng Tháng 8, P.Xuân Hoà, TP.HCM',                                   'manager01'),
('CHAGEE_DK',   N'131 Đồng Khởi, Phường Bến Nghé, TP. HCM',                                     'manager01'),
('CHAGEE_NTMK', N'185 Nguyễn Thị Minh Khai, Phường Bến Thành, TP. HCM',                         'manager01'),
('CHAGEE_NDC',  N'59 Nguyễn Đức Cảnh, Phường Tân Hưng, TP. HCM',                                'manager01');
GO

-- =============================================
-- 4. SẢN PHẨM
-- =============================================
INSERT INTO Products (
    productid, productname, productimage, displayprice,
    category, descriptionU, approvedby
) VALUES
('P01', N'Trà Sữa Xanh Nhài',                       'images/products_img/ts_xanh_nhai.png', 69000, N'Trà Sữa Tươi Nguyên Lá',           N'Trà sữa xanh nhài thơm mát, hậu vị tinh tế',            'manager01'),
('P02', N'Trà Sữa Ô Long Quế Hoa',                  'images/products_img/ts_olong_que_hoa.png', 71000, N'Trà Sữa Tươi Nguyên Lá',       N'Trà ô long phối hoa quế, vị ngọt thanh tao',            'manager01'),
('P03', N'Trà Sữa Thiết Quan Âm',                   'images/products_img/ts_thiet_quan_am.png', 68000, N'Trà Sữa Tươi Nguyên Lá',       N'Trà Thiết Quan Âm hương trà tinh tế, hậu vị mượt mà',   'manager01'),
('P04', N'Trà Sữa Xanh Nếp',                        'images/products_img/ts_xanh_nep.png', 67000, N'Trà Sữa Tươi Nguyên Lá',            N'Trà xanh nếp độc đáo, hòa quyện sữa tươi chất lượng',   'manager01'),
('P05', N'Trà Sữa Đại Hồng Bào',                    'images/products_img/ts_dai_hong_bao.png', 75000, N'Trà Sữa Tươi Nguyên Lá',        N'Trà sữa Đại Hồng Bào đậm đà, hương sắc sâu lắng',       'manager01'),
('P06', N'Trà Sữa Phổ Nhĩ Hoa Hồng',                'images/products_img/ts_pho_nhi_hoa_hong.png', 78000, N'Trà Sữa Tươi Nguyên Lá',    N'Trà Phổ Nhĩ kết hợp hoa hồng đỏ, vị mịn màng',          'manager01'),
('P07', N'Trà Sữa Đen Mộc Khói',                    'images/products_img/ts_den_moc_khoi.png', 70000, N'Trà Sữa Tươi Nguyên Lá',        N'Trà sữa đen mộc khói, cân bằng vị đậm và nhẹ',          'manager01'),
('P08', N'Trà Nguyên Bản Đại Hồng Bào',             'images/products_img/t_pho_nhi_dai_hong_bao.png', 59000, N'Trà Nguyên Bản',                 N'Trà nguyên bản Đại Hồng Bào, hương vị trà thuần túy',   'manager01'),
('P09', N'Trà Nguyên Bản Ô Long Quế Hoa',           'images/products_img/t_olong_que_hoa.png', 60000, N'Trà Nguyên Bản',                N'Trà ô long quế hoa, thơm mát tự nhiên',                 'manager01'),
('P10', N'Teaspresso Latte Đại Hồng Bào',           'images/products_img/lat_dai_hong_bao.png', 69000, N'Teaspresso Latte',             N'Trà Latte Đại Hồng Bào, vị đậm, béo nhẹ',               'manager01'),
('P11', N'Teaspresso Latte Mộc Khói',               'images/products_img/lat_moc_khoi.png', 69000, N'Teaspresso Latte',                 N'Trà Latte Mộc Khói, hương vị khói đặc trưng',           'manager01'),
('P12', N'Teaspresso Frappé Phổ Nhĩ Vân Nam Oreo',  'images/products_img/fra_pho_nhi_van_nam.png', 79000, N'Teaspresso Frappé',         N'Frappé Phổ Nhĩ kết hợp Oreo, thơm ngọt',                'manager01'),
('P13', N'Teaspresso Frappé Đại Hồng Bào Caramel',  'images/products_img/fra_dai_hong_bao_cara.png', 78000, N'Teaspresso Frappé',       N'Frappé Đại Hồng Bào với caramel, béo mịn',              'manager01'),
('P14', N'Trà Sữa Snow Cap Đại Hồng Bào',           'images/products_img/snow_cap_ts_dai_hong_bao.png', 75000, N'Trà Sữa Snow Cap',     N'Trà sữa Snow Cap lớp kem tươi, vị sảng khoái',          'manager01'),
('P15', N'Trà Sữa Snow Cap Oolong Quế Hoa',         'images/products_img/snow_cap_ts_olong_que_hoa.png', 76000, N'Trà Sữa Snow Cap',    N'Trà sữa Snow Cap Oolong Quế Hoa, thơm nhẹ, mịn màng',   'manager01');
GO

-- =============================================
-- 5. VOUCHER
-- =============================================
INSERT INTO Vouchers (
    vouchercode, vouchername, discountpercentage,
    maxdiscount, minordervalue, createdby
) VALUES
('SALE10',      N'Giảm 10%',     10,    30000, 100000,  'manager01'),
('BUY2GET1',    N'Mua 2 tặng 1', NULL,  20000, 50000,   'manager01');
GO

-- =============================================
-- 6. VOUCHER APPLIED
-- =============================================
INSERT INTO VoucherAppliedItems (
    vouchercode, applicableobject
) VALUES
('SALE10',   N'Trà sữa'),
('SALE10',   N'Trà');
GO

-- -- =============================================
-- -- 7. ĐƠN HÀNG
-- -- =============================================
-- INSERT INTO Orders (
--     order_id, payment_method, original_price,
--     statusU, buyer_username, branch_id
-- ) VALUES
-- ('ORD001', N'COD', 80000, N'Pending', 'member01', 'CHAGEE_LBB'),
-- ('ORD002', N'VNPay', 120000, N'Completed', 'member02', 'CHAGEE_CMT8');
-- GO

-- -- =============================================
-- -- 8. CHI TIẾT ĐƠN HÀNG
-- -- =============================================
-- INSERT INTO OrderDetails (
--     order_id, product_id, quantity
-- ) VALUES
-- ('ORD001', 'P01', 1),
-- ('ORD001', 'P03', 1),
-- ('ORD002', 'P02', 2),
-- ('ORD002', 'P04', 1);
-- GO

-- -- =============================================
-- -- 9. VOUCHER ÁP DỤNG CHO ĐƠN
-- -- =============================================
-- INSERT INTO OrderVouchers (
--     order_id, voucher_code
-- ) VALUES
-- ('ORD002', 'SALE10');
-- GO

-- -- =============================================
-- -- 10. GIAO DỊCH
-- -- =============================================
-- INSERT INTO Transactions (
--     transaction_id, order_id, buyer_username,
--     amount, payment_gateway, bank_name
-- ) VALUES
-- ('TXN001', 'ORD002', 'member02', 108000, N'VNPay', N'Vietcombank');
-- GO

-- USE chagee_db;
-- GO

-- PRINT N'=== 1. NHÓM NGƯỜI DÙNG & TÀI KHOẢN ===';
-- SELECT * FROM Admins;            --1
-- SELECT * FROM Buyers;            --2
-- SELECT * FROM SocialAccounts;    --3
-- SELECT * FROM BuyerBankAccounts; --4
-- SELECT * FROM AccountBans;       --5

-- PRINT N'=== 2. NHÓM CỬA HÀNG & SẢN PHẨM ===';
-- SELECT * FROM Branches;          --6
-- SELECT * FROM Products;          --7

-- PRINT N'=== 3. NHÓM KHUYẾN MÃI (VOUCHER) ===';
-- SELECT * FROM Vouchers;            --8
-- SELECT * FROM VoucherAppliedItems; --9

-- PRINT N'=== 4. NHÓM ĐƠN HÀNG & GIAO DỊCH ===';
-- SELECT * FROM Orders;        --10
-- SELECT * FROM OrderDetails;  --11
-- SELECT * FROM OrderVouchers; --12
-- SELECT * FROM Transactions;  --13
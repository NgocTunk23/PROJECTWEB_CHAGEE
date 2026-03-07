USE master;
GO
-- Kiểm tra và xóa database nếu đã tồn tại để tránh lỗi "file already exists"
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'chagee_db')
BEGIN
    -- Ngắt toàn bộ kết nối đang có để có quyền xóa
    ALTER DATABASE chagee_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE chagee_db;
END
GO
-- Tạo mới database
CREATE DATABASE chagee_db;
GO
USE chagee_db;
GO
IF OBJECT_ID('UserVouchers', 'U') IS NOT NULL DROP TABLE UserVouchers;
IF OBJECT_ID('OrderVouchers', 'U') IS NOT NULL DROP TABLE OrderVouchers;
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('Vouchers', 'U') IS NOT NULL DROP TABLE Vouchers;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Branches', 'U') IS NOT NULL DROP TABLE Branches;
IF OBJECT_ID('Buyers', 'U') IS NOT NULL DROP TABLE Buyers;
IF OBJECT_ID('Admins', 'U') IS NOT NULL DROP TABLE Admins;

GO
-- =============================================
-- 1. BẢNG QUẢN TRỊ VIÊN
-- =============================================
IF OBJECT_ID('Admins', 'U') IS NOT NULL DROP TABLE Admins;
CREATE TABLE Admins (
    username VARCHAR(255) PRIMARY KEY,
    passwordU VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fullname NVARCHAR(100),
    phonenumber VARCHAR(20),
    createdat DATETIME DEFAULT GETDATE(),
    dob DATE,
    avatarlink VARCHAR(MAX),
    gender NVARCHAR(10),
    permissionlevel INT DEFAULT 1, -- Cấp độ quyền (VD: 1= QUẢN LÝ CHI NHÁNH, 10= CHỦ SỞ HỮU)--
    lastlogin DATETIME
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
-- 3. BẢNG SẢN PHẨM VÀ CHI NHÁNH
-- =============================================
IF OBJECT_ID('Branches', 'U') IS NOT NULL DROP TABLE Branches;
CREATE TABLE Branches (
    branchid VARCHAR(255) PRIMARY KEY,
    branch_name NVARCHAR(255),            -- Tên hiển thị đẹp (VD: CHAGEE Bàu Cát)
    addressU NVARCHAR(255) NOT NULL,      -- Địa chỉ (Cũ)
    latitude FLOAT,                       -- Vĩ độ (Google Maps)
    longitude FLOAT,                      -- Kinh độ (Google Maps)
    open_time VARCHAR(5) DEFAULT '09:00', -- Giờ mở cửa (VD: 09:00)
    close_time VARCHAR(5) DEFAULT '22:00',-- Giờ đóng cửa (VD: 22:00)
    managerusername VARCHAR(255),         -- Người quản lý
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
-- 4. KHUYẾN MÃI (VOUCHER)
-- =============================================
IF OBJECT_ID('Vouchers', 'U') IS NOT NULL DROP TABLE Vouchers;
CREATE TABLE Vouchers (
    vouchercode VARCHAR(255) PRIMARY KEY,
    vouchername NVARCHAR(100),
    discountamount DECIMAL(18, 2),
    discountpercentage INT,
    maxdiscount DECIMAL(18, 2),
    minordervalue DECIMAL(18, 2),
    expirydate DATE, -- ✅ THÊM DÒNG NÀY: Hạn sử dụng
    createdby VARCHAR(255), -- Người tạo là Admin
    FOREIGN KEY (createdby) REFERENCES Admins(username)
);
GO

-- =============================================
-- 5. ĐƠN HÀNG VÀ GIAO DỊCH
-- =============================================
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
CREATE TABLE Orders (
    orderid VARCHAR(255) PRIMARY KEY,
    
    paymentmethod NVARCHAR(255),
    originalprice DECIMAL(18, 2),
    taxprice NUMERIC(38,2),

    
    statusU NVARCHAR(255) DEFAULT N'Pending',
    ordertime DATETIME DEFAULT GETDATE(),
    paymenttime DATETIME,
    completiontime DATETIME,

    buyerusername VARCHAR(255), -- Người mua
    branchid VARCHAR(255),

    vouchercode VARCHAR(50), -- ⚠️ PHẢI CÓ DÒNG NÀY NÈ ÔNG TÔN!

    -- ⚠️ THÊM LẠI 2 DÒNG NÀY ÔNG TÔN ƠI!
    phonenumber VARCHAR(20),
    addressU NVARCHAR(MAX),

    note NVARCHAR(MAX),   -- (Tùy chọn: Thêm ghi chú)


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
-- =============================================
-- 6. BẢNG CHI TIẾT ĐƠN HÀNG (ĐÃ SỬA: THÊM CỘT ID)
-- =============================================
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;

CREATE TABLE OrderDetails (
    -- ✅ THÊM DÒNG NÀY: Cột id tự tăng để khớp với biến "Long id" trong Java
    id BIGINT IDENTITY(1,1) PRIMARY KEY, 
    
    orderid VARCHAR(255),
    productid VARCHAR(255),
    
    quantity INT DEFAULT 1,
    
    price DECIMAL(18, 2), -- (Tùy chọn: Thêm để lưu giá lúc mua)

    sizelevel NVARCHAR(50), -- (Tùy chọn: Kích thước sản phẩm, nếu có)

    sugarlevel NVARCHAR(50), -- (Tùy chọn: Độ ngọt, nếu có)

    icelevel NVARCHAR(50), -- (Tùy chọn: Độ đá, nếu có)
    
    -- Khóa ngoại
    FOREIGN KEY (orderid) REFERENCES Orders(orderid) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES Products(productid)
);
GO
-- =============================================
-- BỔ SUNG: BẢNG QUẢN LÝ VOUCHER CỦA TỪNG NGƯỜI
-- =============================================
-- Xóa bảng cũ và tạo lại với cột usage_left


CREATE TABLE UserVouchers (
    username VARCHAR(255),
    vouchercode VARCHAR(255),
    usage_left INT DEFAULT 3, -- ✅ Số lần còn lại (Mặc định là 3)
    PRIMARY KEY (username, vouchercode),
    FOREIGN KEY (username) REFERENCES Buyers(username),
    FOREIGN KEY (vouchercode) REFERENCES Vouchers(vouchercode)
);
GO
GO
CREATE OR ALTER TRIGGER trg_UpdateUsageLeft
ON Orders -- ⚠️ Bắt buộc phải là bảng Orders (vì đơn hàng lưu ở đây)
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Thực hiện trừ 1 lượt dùng trong bảng UserVouchers
    UPDATE uv
    SET uv.usage_left = uv.usage_left - 1
    FROM UserVouchers uv
    INNER JOIN inserted i ON uv.vouchercode = i.vouchercode 
    -- 'inserted' là bảng tạm chứa dữ liệu vừa INSERT vào 'Orders'
    WHERE uv.username = i.buyerusername 
      AND i.vouchercode IS NOT NULL; -- Chỉ chạy khi đơn hàng thực sự có dùng mã
END;
GO
-- =============================================
-- DATA
-- =============================================
USE chagee_db;
GO
-- =============================================
-- 1. ADMIN
-- =============================================
-- 1. ADMINS (Dùng {noop} để báo Java đây là mật khẩu thô)
INSERT INTO Admins (username, passwordU, email, phonenumber, fullname, permissionlevel) VALUES 
('manager01', '{noop}123456789', 'manager01@chagee.com', '0909000001', N'Nguyễn Ngọc Tôn', 10),
('manager02', '{noop}123456789', 'manager02@chagee.com', '0909000002', N'Phan Ngọc Quỳnh Trang', 10);
GO

-- 2. BUYERS
INSERT INTO Buyers (username, passwordU, email, phonenumber, fullname, rewardpoints, membershiptier) VALUES 
('member01', '{noop}123456789', 'member01@gmail.com', '0911000002', N'Nguyễn Văn An', 600, N'Silver'),
('member02', '{noop}123456789', 'member02@gmail.com', '0911000003', N'Trần Nhi', 300, N'Gold');
GO
-- =============================================
-- 3. CHI NHÁNH (***FIXED***)
-- =============================================
-- Removed 'branchname' from the column list to match the VALUES and Table Definition
INSERT INTO Branches (
    branchid, branch_name, addressU, latitude, longitude, open_time, close_time, managerusername
) VALUES
-- 1. Tân Phú
('CHAGEE_LBB', N'CHAGEE Lũy Bán Bích', N'462 Lũy Bán Bích, Phường Tân Phú, TP. HCM', 10.785432, 106.632145, '09:00', '22:30', 'manager01'),
('CHAGEE_TSN', N'CHAGEE Tân Sơn Nhì',  N'369A Tân Sơn Nhì, Phường Phú Thọ Hoà, TP. HCM', 10.801234, 106.623456, '09:00', '22:30', 'manager01'),

-- 2. Quận 1
('CHAGEE_NTB', N'CHAGEE Nguyễn Thái Bình', N'162 Nguyễn Thái Bình, P.Nguyễn Thái Bình, Q.1, TP. HCM', 10.769500, 106.698200, '08:00', '22:00', 'manager01'),
('CHAGEE_MPL', N'CHAGEE mPlaza',          N'GF02, Tầng Trệt mPlaza, 39 Lê Duẩn, Q.1, TP. HCM', 10.782100, 106.701500, '09:00', '22:00', 'manager01'),
('CHAGEE_DK',  N'CHAGEE Đồng Khởi',       N'131 Đồng Khởi, Phường Bến Nghé, Q.1, TP. HCM', 10.776500, 106.702800, '09:00', '22:30', 'manager01'),
('CHAGEE_LTT', N'CHAGEE Lý Tự Trọng',     N'200A Lý Tự Trọng, Phường Bến Thành, Q.1, TP. HCM', 10.772300, 106.698100, '08:30', '23:00', 'manager01'),
('CHAGEE_NTMK',N'CHAGEE N.T.Minh Khai',   N'185 Nguyễn Thị Minh Khai, P.Bến Thành, Q.1, TP. HCM', 10.785400, 106.695200, '08:00', '22:00', 'manager01'),

-- 3. TP. Thủ Đức (Quận 2, 9 cũ)
('CHAGEE_VGP', N'CHAGEE Grand Park',      N'101.S05 Vinhomes Grand Park, Q.9, TP. HCM', 10.840200, 106.835600, '09:00', '22:00', 'manager01'),
('CHAGEE_CAT', N'CHAGEE Cantavil',        N'Cantavil An Phú, 01 Đường Song Hành, Q.2, TP. HCM', 10.801692, 106.741639, '09:00', '22:00', 'manager01'),

-- 4. Tân Bình
('CHAGEE_BC',  N'CHAGEE Bàu Cát',         N'133-135 Bàu Cát, Phường Tân Bình, TP. HCM', 10.796366, 106.647960, '08:00', '22:30', 'manager01'),
('CHAGEE_PQ',  N'CHAGEE Phổ Quang',       N'119G-119H Phổ Quang, Phường Đức Nhuận, TP. HCM', 10.805200, 106.670500, '09:00', '22:00', 'manager01'),
('CHAGEE_LVS', N'CHAGEE Lê Văn Sỹ',       N'236A Lê Văn Sỹ, Phường Tân Sơn Hoà, TP. HCM', 10.788500, 106.668200, '09:00', '23:00', 'manager01'),
('CHAGEE_CMT8',N'CHAGEE CMT8',            N'66B Cách Mạng Tháng 8, P.Xuân Hoà, TP.HCM', 10.790100, 106.655400, '08:00', '22:00', 'manager01'),

-- 5. Quận 6
('CHAGEE_HG',  N'CHAGEE Hậu Giang',       N'584-586-588 Hậu Giang, Phường Phú Lâm, TP. HCM', 10.748900, 106.635200, '09:00', '22:00', 'manager01'),

-- 6. Bình Thạnh
('CHAGEE_NGT', N'CHAGEE Nguyễn Gia Trí',  N'116 Nguyễn Gia Trí, Phường Bình Thạnh, TP. HCM', 10.803400, 106.715600, '08:00', '23:00', 'manager01'),
('CHAGEE_VCP', N'CHAGEE Central Park',    N'Vinhomes Central Park C1.SH06, Bình Thạnh, TP. HCM', 10.795200, 106.722100, '08:00', '22:00', 'manager01'),

-- 7. Quận 10
('CHAGEE_VHM', N'CHAGEE Vạn Hạnh Mall',   N'Tầng 1, Vạn Hạnh Mall, 11 Sư Vạn Hạnh, Q.10, TP. HCM', 10.770500, 106.670300, '09:30', '22:00', 'manager01'),

-- 8. Quận 5
('CHAGEE_NT',  N'CHAGEE Nguyễn Trãi',     N'440 Nguyễn Trãi, Phường An Đông, Q.5, TP. HCM', 10.755600, 106.675400, '09:00', '23:00', 'manager01'),
('CHAGEE_LHP', N'CHAGEE Lê Hồng Phong',   N'178-180 Lê Hồng Phong, Phường Chợ Quán, Q.5, TP. HCM', 10.762300, 106.672500, '09:00', '22:00', 'manager01'),

-- 9. Phú Nhuận
('CHAGEE_PXL', N'CHAGEE Phan Xích Long',  N'181 Phan Xích Long, Phường Cầu Kiệu, TP. HCM', 10.794200, 106.690100, '08:00', '23:00', 'manager01'),

-- 10. Quận 7
('CHAGEE_NDC', N'CHAGEE Nguyễn Đức Cảnh', N'59 Nguyễn Đức Cảnh, Phường Tân Hưng, Q.7, TP. HCM', 10.725600, 106.708900, '09:00', '22:00', 'manager01'),

('CHAGEE_DEMO', N'CHAGEE DEMO',  N'181 Phan Xích Long, Phường Cầu Kiệu, TP. HCM', 10.794200, 106.690100, '00:00', '23:59', 'manager01');
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
    vouchercode, 
    vouchername, 
    discountamount, 
    discountpercentage, 
    maxdiscount, 
    minordervalue, 
    expirydate, 
    createdby
) VALUES
-- 1. Voucher giảm 10% (Tối đa 50k cho đơn từ 100k)
('DISCOUNT10', N'Ưu đãi Oolong - Giảm 10%', NULL, 10, 50000, 100000, '2026-06-30', 'manager01'),

-- 2. Voucher giảm thẳng 30.000đ (Cho đơn từ 150k)
('CASH30K', N'Tiệc Trà Chiều - Giảm 30k', 30000, NULL, 30000, 150000, '2026-05-15', 'manager01'),

-- 3. Voucher Mua 2 Tặng 1 (Logic tính toán thường để mức giảm 0 hoặc xử lý ở App)
('B2G1FREE', N'Mua 2 Tặng 1 - Member Mới', NULL, NULL, NULL, 80000, '2026-04-01', 'manager01');
GO
INSERT INTO UserVouchers (username, vouchercode, usage_left)
VALUES 
('member01', 'DISCOUNT10', 1), 
('member01', 'CASH30K', 1),    
('member01', 'B2G1FREE', 1),   
('member02', 'CASH30K', 1),
('member02', 'DISCOUNT10', 1),
('member02', 'B2G1FREE', 0);
GO

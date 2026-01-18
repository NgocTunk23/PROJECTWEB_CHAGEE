USE chagee_db;
GO

-- ======================================================================================
-- PHẦN 1: QUẢN LÝ SẢN PHẨM (SEARCH & CRUD)
-- ======================================================================================

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 1: TRA CỨU SẢN PHẨM CHUYÊN SÂU
-- Chức năng: Tìm kiếm theo tên, giá, danh mục và từ khóa tổng hợp
-- Tương ứng cũ: sp_TraCuuSanPham
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_SearchProducts
    @Keyword NVARCHAR(255) = NULL,   -- Tìm chung (Tên, Mã, Mô tả)
    @Category NVARCHAR(50) = NULL,   -- Lọc danh mục
    @MinPrice DECIMAL(18,2) = NULL,  -- Giá thấp nhất
    @MaxPrice DECIMAL(18,2) = NULL   -- Giá cao nhất
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.product_id,
        p.product_name,
        p.display_price,
        p.category,
        p.descriptionU,
        p.sold_quantity,
        -- Lấy thông tin người duyệt (Admin) thay vì Chủ Shop
        a.full_name AS [Admin_Approved],
        a.email AS [Admin_Contact]
    FROM Products p
    LEFT JOIN Admins a ON p.approved_by = a.username
    WHERE 
        -- 1. Bộ lọc chi tiết
        (@Category IS NULL OR p.category LIKE N'%' + @Category + '%')
        AND (@MinPrice IS NULL OR p.display_price >= @MinPrice)
        AND (@MaxPrice IS NULL OR p.display_price <= @MaxPrice)
        
        -- 2. Tìm kiếm tổng hợp (@Keyword)
        AND (@Keyword IS NULL OR (
            p.product_id LIKE '%' + @Keyword + '%' OR
            p.product_name LIKE N'%' + @Keyword + '%' OR
            p.descriptionU LIKE N'%' + @Keyword + '%' OR
            CAST(p.display_price AS NVARCHAR(50)) LIKE '%' + @Keyword + '%'
        ))
    ORDER BY p.product_name ASC;
END;
GO

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 2: THÊM SẢN PHẨM MỚI (CÓ VALIDATION)
-- Tương ứng cũ: sp_ThemSanPham
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_AddProduct
    @product_id VARCHAR(50),
    @product_name NVARCHAR(100),
    @display_price DECIMAL(18, 2),
    @category NVARCHAR(50),
    @description NVARCHAR(MAX) = NULL,
    @image_link VARCHAR(MAX) = NULL,
    @admin_username VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDATE 1: Giá phải > 0
    IF @display_price <= 0
    BEGIN
        RAISERROR(N'Lỗi: Giá bán phải lớn hơn 0!', 16, 1);
        RETURN;
    END

    -- VALIDATE 2: Mã sản phẩm trùng
    IF EXISTS (SELECT 1 FROM Products WHERE product_id = @product_id)
    BEGIN
        RAISERROR(N'Lỗi: Mã sản phẩm %s đã tồn tại!', 16, 1, @product_id);
        RETURN;
    END

    -- VALIDATE 3: Admin tồn tại
    IF NOT EXISTS (SELECT 1 FROM Admins WHERE username = @admin_username)
    BEGIN
        RAISERROR(N'Lỗi: Admin duyệt không tồn tại!', 16, 1);
        RETURN;
    END

    -- THỰC HIỆN INSERT
    BEGIN TRY
        INSERT INTO Products (
            product_id, product_name, display_price, category, 
            descriptionU, product_image, sold_quantity, approved_by
        )
        VALUES (
            @product_id, @product_name, @display_price, @category, 
            @description, @image_link, 0, @admin_username
        );
        PRINT N'✅ Thêm sản phẩm thành công!';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 3: CẬP NHẬT SẢN PHẨM
-- Tương ứng cũ: sp_CapNhatSanPham
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_UpdateProduct
    @product_id VARCHAR(50),
    @product_name NVARCHAR(100) = NULL,
    @display_price DECIMAL(18, 2) = NULL,
    @category NVARCHAR(50) = NULL,
    @description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDATE: Sản phẩm tồn tại
    IF NOT EXISTS (SELECT 1 FROM Products WHERE product_id = @product_id)
    BEGIN
        RAISERROR(N'Lỗi: Sản phẩm không tồn tại!', 16, 1);
        RETURN;
    END

    -- VALIDATE: Giá mới (nếu có)
    IF @display_price IS NOT NULL AND @display_price <= 0
    BEGIN
        RAISERROR(N'Lỗi: Giá mới phải lớn hơn 0!', 16, 1);
        RETURN;
    END

    BEGIN TRY
        UPDATE Products
        SET 
            product_name = ISNULL(@product_name, product_name),
            display_price = ISNULL(@display_price, display_price),
            category = ISNULL(@category, category),
            descriptionU = ISNULL(@description, descriptionU)
        WHERE product_id = @product_id;
        
        PRINT N'✅ Cập nhật sản phẩm thành công!';
    END TRY
    BEGIN CATCH
        DECLARE @Error NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Error, 16, 1);
    END CATCH
END;
GO

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 4: XÓA SẢN PHẨM (AN TOÀN)
-- Tương ứng cũ: sp_XoaSanPham
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_DeleteProduct
    @product_id VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDATE 1: Sản phẩm tồn tại
    IF NOT EXISTS (SELECT 1 FROM Products WHERE product_id = @product_id)
    BEGIN
        RAISERROR(N'Lỗi: Sản phẩm không tồn tại!', 16, 1);
        RETURN;
    END

    -- VALIDATE 2: Đang có trong đơn hàng (Constraint)
    IF EXISTS (SELECT 1 FROM OrderDetails WHERE product_id = @product_id)
    BEGIN
        RAISERROR(N'Lỗi: Không thể xóa vì sản phẩm đang nằm trong đơn hàng!', 16, 1);
        RETURN;
    END

    BEGIN TRY
        DELETE FROM Products WHERE product_id = @product_id;
        PRINT N'✅ Xóa sản phẩm thành công!';
    END TRY
    BEGIN CATCH
        DECLARE @Error NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Error, 16, 1);
    END CATCH
END;
GO


-- ======================================================================================
-- PHẦN 2: BÁO CÁO THỐNG KÊ (ANALYTICS)
-- ======================================================================================

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 5: THỐNG KÊ DOANH THU THEO CHI NHÁNH
-- Tương ứng cũ: sp_ThongKeDoanhThuShop
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_GetBranchRevenue
    @Year INT, -- Năm báo cáo
    @MinRevenue DECIMAL(18,2) = 0 -- Lọc chi nhánh có doanh thu thấp nhất là bao nhiêu
AS
BEGIN
    SELECT 
        b.branch_id,
        b.addressU AS [Branch_Address],
        a.full_name AS [Manager_Name],
        COUNT(o.order_id) AS [Total_Orders], -- Tổng số đơn
        ISNULL(SUM(o.original_price), 0) AS [Total_Revenue] -- Tổng doanh thu
    FROM Branches b
    LEFT JOIN Orders o ON b.branch_id = o.branch_id
    LEFT JOIN Admins a ON b.manager_username = a.username
    WHERE 
        YEAR(o.order_time) = @Year
        AND o.statusU = 'Completed' -- Chỉ tính đơn đã hoàn thành
    GROUP BY 
        b.branch_id, b.addressU, a.full_name
    HAVING 
        ISNULL(SUM(o.original_price), 0) >= @MinRevenue
    ORDER BY 
        [Total_Revenue] DESC;
END;
GO

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 6: TOP SẢN PHẨM BÁN CHẠY
-- Tương ứng cũ: sp_ThongKeSanPhamBanChay
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_GetBestSellingProducts
    @TopN INT = 10,
    @Category NVARCHAR(50) = NULL
AS
BEGIN
    SELECT TOP (@TopN)
        p.product_id,
        p.product_name,
        p.category,
        p.display_price,
        ISNULL(SUM(od.quantity), 0) AS [Total_Sold_Qty], -- Tổng số ly đã bán
        ISNULL(SUM(od.quantity * p.display_price), 0) AS [Estimated_Revenue] -- Doanh thu ước tính
    FROM Products p
    LEFT JOIN OrderDetails od ON p.product_id = od.product_id
    LEFT JOIN Orders o ON od.order_id = o.order_id
    WHERE 
        (@Category IS NULL OR p.category = @Category)
        AND (o.statusU = 'Completed' OR o.statusU IS NULL) -- Chỉ tính đơn đã xong (hoặc lấy tất cả SP nếu chưa bán)
    GROUP BY 
        p.product_id, p.product_name, p.category, p.display_price
    ORDER BY 
        [Total_Sold_Qty] DESC;
END;
GO

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 7: TOP KHÁCH HÀNG VIP
-- Tương ứng cũ: sp_ThongKeTopKhachHang
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_GetTopBuyers
    @TopN INT = 5,
    @MinSpending DECIMAL(18,2) = 0
AS
BEGIN
    SELECT TOP (@TopN)
        b.username,
        b.full_name,
        b.phone,
        b.membership_tier,
        COUNT(o.order_id) AS [Total_Orders],
        ISNULL(SUM(o.original_price), 0) AS [Total_Spent]
    FROM Buyers b
    JOIN Orders o ON b.username = o.buyer_username
    WHERE o.statusU = 'Completed'
    GROUP BY 
        b.username, b.full_name, b.phone, b.membership_tier
    HAVING 
        ISNULL(SUM(o.original_price), 0) >= @MinSpending
    ORDER BY 
        [Total_Spent] DESC;
END;
GO


-- ======================================================================================
-- PHẦN 3: GIAO DỊCH & XỬ LÝ ĐƠN HÀNG
-- ======================================================================================

-- ---------------------------------------------------------------------------------------
-- THỦ TỤC 8: TẠO ĐƠN HÀNG (TRANSACTION)
-- Tương ứng cũ: sp_DatHang
-- Chức năng: Tạo đơn hàng -> Áp dụng Voucher (nếu có) -> Đảm bảo tính toàn vẹn
-- ---------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_PlaceOrder
    @OrderID VARCHAR(50),
    @BuyerUsername VARCHAR(50),
    @BranchID VARCHAR(50),
    @PaymentMethod NVARCHAR(50),
    @TotalAmount DECIMAL(18,2), -- Tổng tiền đơn hàng
    @VoucherCode VARCHAR(50) = NULL -- Mã giảm giá (nếu có)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION; -- Bắt đầu giao dịch

        -- 1. Validate: Khách và Chi nhánh phải tồn tại
        IF NOT EXISTS (SELECT 1 FROM Buyers WHERE username = @BuyerUsername)
        BEGIN
            RAISERROR(N'Khách hàng không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Branches WHERE branch_id = @BranchID)
        BEGIN
            RAISERROR(N'Chi nhánh không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Validate: Đơn hàng trùng ID
        IF EXISTS (SELECT 1 FROM Orders WHERE order_id = @OrderID)
        BEGIN
            RAISERROR(N'Mã đơn hàng đã tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 3. Tạo Đơn Hàng (Orders)
        INSERT INTO Orders (
            order_id, buyer_username, branch_id, 
            payment_method, original_price, statusU, order_time
        )
        VALUES (
            @OrderID, @BuyerUsername, @BranchID, 
            @PaymentMethod, @TotalAmount, N'Pending', GETDATE()
        );

        -- 4. Áp dụng Voucher (Nếu có)
        IF @VoucherCode IS NOT NULL
        BEGIN
            -- Kiểm tra voucher có tồn tại không
            IF EXISTS (SELECT 1 FROM Vouchers WHERE voucher_code = @VoucherCode)
            BEGIN
                INSERT INTO OrderVouchers (order_id, voucher_code)
                VALUES (@OrderID, @VoucherCode);
            END
            ELSE
            BEGIN
                -- Nếu voucher sai -> Vẫn tạo đơn nhưng cảnh báo (hoặc Rollback tùy logic)
                PRINT N'⚠️ Cảnh báo: Voucher không hợp lệ, đơn hàng được tạo không có voucher.';
            END
        END

        COMMIT TRANSACTION; -- Xác nhận giao dịch thành công
        PRINT N'✅ Đặt hàng thành công!';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; -- Hoàn tác nếu lỗi
        DECLARE @Error NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Error, 16, 1);
    END CATCH
END;
GO

PRINT N'=== ĐÃ TẠO XONG TẤT CẢ STORED PROCEDURES ===';
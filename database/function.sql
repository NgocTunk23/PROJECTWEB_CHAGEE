USE chagee_db;
GO

-- ======================================================================================
-- FILE TỔNG HỢP FUNCTION & STORED PROCEDURE (CHAGEE VERSION)
-- Mục đích: Tính toán hóa đơn, gợi ý voucher và quản lý đơn hàng cho Chi nhánh
-- ======================================================================================

-- --------------------------------------------------------------------------------------
-- 1. FUNCTION: LẤY DANH SÁCH VOUCHER KHẢ DỤNG CHO ĐƠN HÀNG
-- Chức năng: Kiểm tra đơn hàng này có thể áp dụng những mã nào dựa trên Giá trị đơn tối thiểu
-- --------------------------------------------------------------------------------------
CREATE OR ALTER FUNCTION dbo.fn_GetAvailableVouchers
(
    @OrderID VARCHAR(50)
)
RETURNS @Result TABLE
(
    VoucherCode VARCHAR(50),
    VoucherName NVARCHAR(100),
    DiscountDesc NVARCHAR(255), -- Mô tả giảm giá
    DiscountAmount DECIMAL(18, 2), -- Số tiền được giảm dự kiến
    Condition NVARCHAR(255),
    IsApplicable BIT, -- 1: Dùng được, 0: Không dùng được
    Reason NVARCHAR(255)
)
AS
BEGIN
    DECLARE @OriginalPrice DECIMAL(18, 2);
    
    -- Lấy giá trị gốc của đơn hàng
    SELECT @OriginalPrice = original_price 
    FROM Orders WHERE order_id = @OrderID;

    IF @OriginalPrice IS NULL RETURN;

    -- Duyệt qua tất cả Voucher trong hệ thống
    INSERT INTO @Result (VoucherCode, VoucherName, DiscountDesc, Condition, IsApplicable, Reason, DiscountAmount)
    SELECT 
        v.voucher_code,
        v.voucher_name,
        -- Mô tả giảm giá
        CASE 
            WHEN v.discount_percentage IS NOT NULL THEN N'Giảm ' + CAST(v.discount_percentage AS NVARCHAR) + N'% (Max ' + FORMAT(v.max_discount, 'N0') + N')'
            ELSE N'Giảm trực tiếp ' + FORMAT(v.discount_amount, 'N0') + N'đ'
        END,
        -- Điều kiện
        N'Đơn tối thiểu: ' + FORMAT(v.min_order_value, 'N0') + N'đ',
        -- Kiểm tra khả dụng (IsApplicable)
        CASE 
            WHEN @OriginalPrice >= v.min_order_value THEN 1 
            ELSE 0 
        END,
        -- Lý do
        CASE 
            WHEN @OriginalPrice >= v.min_order_value THEN N'Khả dụng'
            ELSE N'Thiếu ' + FORMAT(v.min_order_value - @OriginalPrice, 'N0') + N'đ để áp dụng'
        END,
        -- Tính toán số tiền giảm (Dự kiến)
        CASE 
            WHEN @OriginalPrice < v.min_order_value THEN 0
            WHEN v.discount_percentage IS NOT NULL THEN 
                -- Logic: Tính % xong so sánh với Max Discount, lấy cái nhỏ hơn (LEAST không có trong SQL cũ nên dùng CASE)
                CASE 
                    WHEN (@OriginalPrice * v.discount_percentage / 100) > ISNULL(v.max_discount, 999999999) 
                    THEN v.max_discount
                    ELSE (@OriginalPrice * v.discount_percentage / 100)
                END
            ELSE v.discount_amount
        END
    FROM Vouchers v;

    RETURN;
END;
GO

-- --------------------------------------------------------------------------------------
-- 2. FUNCTION: TÍNH CHI TIẾT HÓA ĐƠN (FINAL CALCULATION)
-- Chức năng: Tính Tổng tiền hàng - Voucher đã áp dụng + Thuế = Thực trả
-- --------------------------------------------------------------------------------------
CREATE OR ALTER FUNCTION dbo.fn_CalculateOrderTotal
(
    @OrderID VARCHAR(50)
)
RETURNS @InvoiceDetails TABLE
(
    OrderID VARCHAR(50),
    OriginalPrice DECIMAL(18, 2), -- Tiền hàng
    TaxAmount DECIMAL(18, 2),     -- Thuế
    VoucherCode VARCHAR(50),      -- Mã Voucher đã áp dụng
    DiscountAmount DECIMAL(18, 2),-- Số tiền giảm
    FinalTotal DECIMAL(18, 2)     -- Khách phải trả
)
AS
BEGIN
    DECLARE @OriginalPrice DECIMAL(18, 2);
    DECLARE @Tax DECIMAL(18, 2) = 0;
    DECLARE @Discount DECIMAL(18, 2) = 0;
    DECLARE @VoucherCode VARCHAR(50) = NULL;

    -- 1. Lấy thông tin cơ bản
    SELECT 
        @OriginalPrice = original_price,
        @Tax = ISNULL(tax_price, 0)
    FROM Orders WHERE order_id = @OrderID;

    IF @OriginalPrice IS NULL RETURN;

    -- 2. Kiểm tra xem đơn hàng này ĐÃ ÁP DỤNG voucher nào chưa (Trong bảng OrderVouchers)
    -- Giả sử 1 đơn chỉ áp dụng 1 voucher (theo logic phổ biến)
    SELECT TOP 1 
        @VoucherCode = v.voucher_code,
        @Discount = CASE 
            WHEN v.discount_percentage IS NOT NULL THEN 
                CASE 
                    WHEN (@OriginalPrice * v.discount_percentage / 100) > ISNULL(v.max_discount, 999999999) 
                    THEN v.max_discount
                    ELSE (@OriginalPrice * v.discount_percentage / 100)
                END
            ELSE v.discount_amount
        END
    FROM OrderVouchers ov
    JOIN Vouchers v ON ov.voucher_code = v.voucher_code
    WHERE ov.order_id = @OrderID;

    -- 3. Tính tổng cuối
    DECLARE @Final DECIMAL(18, 2);
    SET @Final = @OriginalPrice + @Tax - ISNULL(@Discount, 0);
    
    IF @Final < 0 SET @Final = 0; -- Không để âm tiền

    INSERT INTO @InvoiceDetails (OrderID, OriginalPrice, TaxAmount, VoucherCode, DiscountAmount, FinalTotal)
    VALUES (@OrderID, @OriginalPrice, @Tax, @VoucherCode, ISNULL(@Discount, 0), @Final);

    RETURN;
END;
GO

-- --------------------------------------------------------------------------------------
-- 3. STORED PROCEDURE: ÁP DỤNG VOUCHER VÀ CHỐT ĐƠN (TRANSACTION)
-- Chức năng: Gán voucher vào đơn -> Cập nhật trạng thái
-- --------------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_ApplyVoucherAndCheckout
    @OrderID VARCHAR(50),
    @VoucherCode VARCHAR(50) = NULL -- Có thể null nếu không dùng voucher
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Validate Đơn hàng
        IF NOT EXISTS (SELECT 1 FROM Orders WHERE order_id = @OrderID)
        BEGIN
            RAISERROR(N'Lỗi: Đơn hàng không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Xóa voucher cũ (nếu muốn đổi mã khác)
        DELETE FROM OrderVouchers WHERE order_id = @OrderID;

        -- 3. Xử lý Voucher (Nếu có truyền vào)
        IF @VoucherCode IS NOT NULL AND @VoucherCode <> ''
        BEGIN
            -- Kiểm tra tồn tại
            IF NOT EXISTS (SELECT 1 FROM Vouchers WHERE voucher_code = @VoucherCode)
            BEGIN
                RAISERROR(N'Lỗi: Mã Voucher không tồn tại!', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END

            -- Kiểm tra điều kiện Min Order
            DECLARE @MinVal DECIMAL(18, 2);
            DECLARE @OrderVal DECIMAL(18, 2);
            SELECT @MinVal = min_order_value FROM Vouchers WHERE voucher_code = @VoucherCode;
            SELECT @OrderVal = original_price FROM Orders WHERE order_id = @OrderID;

            IF @OrderVal < @MinVal
            BEGIN
                RAISERROR(N'Lỗi: Đơn hàng chưa đủ giá trị tối thiểu để áp dụng Voucher!', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END

            -- Áp dụng (Insert vào bảng liên kết)
            INSERT INTO OrderVouchers (order_id, voucher_code)
            VALUES (@OrderID, @VoucherCode);
        END

        -- 4. Cập nhật trạng thái đơn (Ví dụ chuyển sang 'Processing')
        UPDATE Orders 
        SET statusU = 'Processing', payment_time = GETDATE()
        WHERE order_id = @OrderID;

        COMMIT TRANSACTION;
        SELECT 1 AS Status, N'Thành công: Đã áp dụng voucher (nếu có) và cập nhật đơn hàng.' AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        SELECT 0 AS Status, @ErrorMessage AS Message;
    END CATCH
END;
GO

-- --------------------------------------------------------------------------------------
-- 4. FUNCTION: LIỆT KÊ ĐƠN HÀNG CỦA CHI NHÁNH (REPORT)
-- Chức năng: Giúp quản lý chi nhánh xem danh sách đơn và doanh thu thực tế
-- --------------------------------------------------------------------------------------
CREATE OR ALTER FUNCTION dbo.fn_GetBranchOrderList(@BranchID VARCHAR(50))
RETURNS @OrderList TABLE
(
    STT INT IDENTITY(1,1),
    OrderID VARCHAR(50),
    BuyerName NVARCHAR(100),
    OrderDate DATETIME,
    Status NVARCHAR(50),
    ProductCount INT,           -- Số lượng món
    OriginalTotal DECIMAL(18,2),-- Giá gốc
    DiscountApplied DECIMAL(18,2), -- Giảm giá
    FinalRevenue DECIMAL(18,2)  -- Doanh thu thực (Sau khi trừ KM)
)
AS
BEGIN
    DECLARE @OrderID VARCHAR(50);
    
    -- Cursor để duyệt qua từng đơn của chi nhánh
    DECLARE cur_Orders CURSOR FOR 
    SELECT order_id 
    FROM Orders 
    WHERE branch_id = @BranchID
    ORDER BY order_time DESC;
    
    OPEN cur_Orders;
    FETCH NEXT FROM cur_Orders INTO @OrderID;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Lấy thông tin từ các bảng và Function tính toán
        INSERT INTO @OrderList (OrderID, BuyerName, OrderDate, Status, ProductCount, OriginalTotal, DiscountApplied, FinalRevenue)
        SELECT 
            o.order_id,
            b.full_name,
            o.order_time,
            o.statusU,
            (SELECT SUM(quantity) FROM OrderDetails WHERE order_id = o.order_id), -- Đếm tổng món
            calc.OriginalPrice,
            calc.DiscountAmount,
            calc.FinalTotal
        FROM Orders o
        LEFT JOIN Buyers b ON o.buyer_username = b.username
        -- Gọi Function tính toán chi tiết để lấy số liệu chính xác
        OUTER APPLY dbo.fn_CalculateOrderTotal(o.order_id) calc
        WHERE o.order_id = @OrderID;
        
        FETCH NEXT FROM cur_Orders INTO @OrderID;
    END
    
    CLOSE cur_Orders; DEALLOCATE cur_Orders;
    RETURN;
END;
GO

-- ======================================================================================
-- TEST CASES (CHẠY THỬ NGHIỆM)
-- ======================================================================================

PRINT N'=== 1. TẠO DỮ LIỆU TEST (Nếu chưa có) ===';
-- Đảm bảo có đơn ORD002 và Voucher SALE10 (đã có trong file init_db.sql của bạn rồi)

PRINT N'';
PRINT N'=== 2. TEST GỢI Ý VOUCHER (fn_GetAvailableVouchers) ===';
-- Kiểm tra xem đơn ORD001 có thể dùng những voucher nào
SELECT * FROM dbo.fn_GetAvailableVouchers('ORD001');

PRINT N'';
PRINT N'=== 3. TEST TÍNH TOÁN HÓA ĐƠN TRƯỚC KHI ÁP DỤNG (fn_CalculateOrderTotal) ===';
-- Xem tiền đơn ORD001 hiện tại (Chưa có voucher)
SELECT * FROM dbo.fn_CalculateOrderTotal('ORD001');

PRINT N'';
PRINT N'=== 4. THỰC HIỆN ÁP DỤNG VOUCHER (sp_ApplyVoucherAndCheckout) ===';
-- Thử áp dụng voucher SALE10 cho đơn ORD001
EXEC dbo.sp_ApplyVoucherAndCheckout @OrderID = 'ORD001', @VoucherCode = 'SALE10';

PRINT N'';
PRINT N'=== 5. KIỂM TRA LẠI SAU KHI ÁP DỤNG ===';
-- Xem lại tiền đơn ORD001 (Lúc này phải thấy DiscountAmount > 0)
SELECT * FROM dbo.fn_CalculateOrderTotal('ORD001');

PRINT N'';
PRINT N'=== 6. BÁO CÁO ĐƠN HÀNG CHI NHÁNH (fn_GetBranchOrderList) ===';
-- Xem danh sách đơn của chi nhánh CHAGEE_LBB
SELECT * FROM dbo.fn_GetBranchOrderList('CHAGEE_LBB');
GO
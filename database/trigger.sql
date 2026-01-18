USE chagee_db;
GO

-- ======================================================================================
-- TRIGGER 1: GHI LOG KHI THÊM/SỬA SẢN PHẨM (Vào bảng ProductAudits)
-- ======================================================================================
CREATE OR ALTER TRIGGER TR_Products_AuditLog
ON Products
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- TRƯỜNG HỢP UPDATE: Ghi lại cái cũ và cái mới
    IF EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO ProductAudits (
            product_id, action_type, changed_by,
            old_product_name, old_price,
            new_product_name, new_price,
            reason
        )
        SELECT
            i.product_id, 'UPDATE', SYSTEM_USER,
            d.product_name, d.display_price,
            i.product_name, i.display_price,
            N'Cập nhật thông tin sản phẩm'
        FROM inserted i
        INNER JOIN deleted d ON i.product_id = d.product_id;
    END
    -- TRƯỜNG HỢP INSERT: Chỉ ghi cái mới
    ELSE
    BEGIN
        INSERT INTO ProductAudits (
            product_id, action_type, changed_by,
            new_product_name, new_price,
            reason
        )
        SELECT
            i.product_id, 'INSERT', SYSTEM_USER,
            i.product_name, i.display_price,
            N'Thêm sản phẩm mới'
        FROM inserted i;
    END
END;
GO

-- ======================================================================================
-- TRIGGER 2: GHI LOG KHI XÓA SẢN PHẨM (Vào bảng ProductDeleteAudits)
-- ======================================================================================
CREATE OR ALTER TRIGGER TR_Products_DeleteLog
ON Products
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductDeleteAudits (
        product_id, deleted_by,
        product_name, price, sold_quantity
    )
    SELECT 
        d.product_id, SYSTEM_USER,
        d.product_name, d.display_price, d.sold_quantity
    FROM deleted d;
    
    PRINT N'⚠️ Đã ghi nhận lịch sử xóa sản phẩm.';
END;
GO



USE chagee_db;
GO

-- ======================================================================================
-- TRIGGER 3: TỰ ĐỘNG CẬP NHẬT 'SOLD_QUANTITY' KHI CÓ ĐƠN HÀNG MỚI
-- Bắt sự kiện trên bảng OrderDetails (Chi tiết đơn hàng)
-- ======================================================================================
CREATE OR ALTER TRIGGER TR_OrderDetails_UpdateSoldQty
ON OrderDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Tăng số lượng đã bán (sold_quantity) cho sản phẩm tương ứng
    UPDATE p
    SET p.sold_quantity = p.sold_quantity + i.quantity
    FROM Products p
    INNER JOIN inserted i ON p.product_id = i.product_id;

    PRINT N'✅ Đã cập nhật tăng số lượng đã bán (sold_quantity).';
END;
GO

-- ======================================================================================
-- TRIGGER 4: HOÀN LẠI 'SOLD_QUANTITY' KHI HỦY ĐƠN HÀNG
-- Bắt sự kiện trên bảng Orders (Khi statusU chuyển sang 'Cancelled')
-- ======================================================================================
CREATE OR ALTER TRIGGER TR_Orders_RollbackSoldQty
ON Orders
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ xử lý khi trạng thái chuyển sang 'Cancelled' (Đã hủy)
    IF EXISTS (
        SELECT 1 
        FROM inserted i 
        JOIN deleted d ON i.order_id = d.order_id 
        WHERE i.statusU = 'Cancelled' AND d.statusU != 'Cancelled'
    )
    BEGIN
        -- Giảm số lượng đã bán (sold_quantity) dựa trên chi tiết đơn hàng đó
        UPDATE p
        SET p.sold_quantity = p.sold_quantity - od.quantity
        FROM Products p
        INNER JOIN OrderDetails od ON p.product_id = od.product_id
        INNER JOIN inserted i ON od.order_id = i.order_id;

        PRINT N'🔄 Đơn hàng đã hủy. Đã trừ lại số lượng đã bán (sold_quantity).';
    END
END;
GO
USE chagee_db;
GO

PRINT N'=== BẮT ĐẦU TEST CASE ===';

-- 1. KIỂM TRA TRIGGER AUDIT (THÊM/SỬA SẢN PHẨM)
PRINT N'--- Test 1: Insert & Update Sản Phẩm ---';

-- Thêm SP Test
INSERT INTO Products (product_id, product_name, display_price, category, sold_quantity, approved_by)
VALUES ('TEST_P01', N'Trà Sữa Test Audit', 50000, N'Test', 0, 'manager01');

-- Sửa giá SP Test
UPDATE Products 
SET display_price = 55000, product_name = N'Trà Sữa Test Audit (Updated)'
WHERE product_id = 'TEST_P01';

-- Kiểm tra bảng Audit
SELECT TOP 2 * FROM ProductAudits ORDER BY audit_id DESC;

-- 2. KIỂM TRA TRIGGER TĂNG SỐ LƯỢNG ĐÃ BÁN (SOLD QUANTITY)
PRINT N'--- Test 2: Tạo đơn hàng mới để tăng sold_quantity ---';

-- Kiểm tra số lượng trước khi bán
DECLARE @SoldBefore INT, @SoldAfter INT;
SELECT @SoldBefore = sold_quantity FROM Products WHERE product_id = 'TEST_P01';

-- Tạo đơn hàng giả định
INSERT INTO Orders (order_id, statusU, buyer_username, branch_id)
VALUES ('ORD_TEST_01', 'Pending', 'member01', 'CHAGEE_LBB');

-- Thêm chi tiết đơn hàng (Mua 5 ly) -> Trigger TR_OrderDetails_UpdateSoldQty sẽ chạy
INSERT INTO OrderDetails (order_id, product_id, quantity)
VALUES ('ORD_TEST_01', 'TEST_P01', 5);

-- Kiểm tra lại
SELECT @SoldAfter = sold_quantity FROM Products WHERE product_id = 'TEST_P01';

IF @SoldAfter = @SoldBefore + 5
    PRINT N'✅ PASS: Sold Quantity đã tăng đúng (+5)';
ELSE
    PRINT N'❌ FAIL: Sold Quantity chưa cập nhật';


-- 3. KIỂM TRA TRIGGER HỦY ĐƠN (HOÀN LẠI SOLD QUANTITY)
PRINT N'--- Test 3: Hủy đơn hàng để hoàn lại sold_quantity ---';

-- Cập nhật trạng thái đơn hàng thành 'Cancelled' -> Trigger TR_Orders_RollbackSoldQty sẽ chạy
UPDATE Orders 
SET statusU = 'Cancelled' 
WHERE order_id = 'ORD_TEST_01';

-- Kiểm tra lại
SELECT @SoldAfter = sold_quantity FROM Products WHERE product_id = 'TEST_P01';

IF @SoldAfter = @SoldBefore
    PRINT N'✅ PASS: Sold Quantity đã hoàn lại về ban đầu';
ELSE
    PRINT N'❌ FAIL: Sold Quantity chưa hoàn lại';

-- 4. DỌN DẸP DỮ LIỆU TEST
-- Xóa chi tiết trước (Do khóa ngoại)
DELETE FROM OrderDetails WHERE order_id = 'ORD_TEST_01';
DELETE FROM Orders WHERE order_id = 'ORD_TEST_01';
DELETE FROM Products WHERE product_id = 'TEST_P01';

-- Kiểm tra Audit xóa
SELECT TOP 1 * FROM ProductDeleteAudits ORDER BY audit_id DESC;

PRINT N'=== KẾT THÚC TEST CASE ===';
GO
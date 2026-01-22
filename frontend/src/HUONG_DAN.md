# 🍵 CHAGEE ORDER SYSTEM - HƯỚNG DẪN SỬ DỤNG

## ✨ TÍNH NĂNG MỚI ĐÃ THÊM

### 1. 🛒 **Giỏ Hàng (Cart)**
- Xem danh sách sản phẩm đã chọn
- Điều chỉnh số lượng (tăng/giảm)
- Xóa sản phẩm khỏi giỏ
- Áp dụng mã giảm giá (voucher)
- Tính tổng tiền tự động

**Cách dùng:**
- Thêm sản phẩm từ trang Thực đơn
- Click icon giỏ hàng 🛍️ (góc phải dưới)
- Quản lý sản phẩm và áp voucher

---

### 2. ✅ **Xác Nhận Đơn Hàng (Checkout)**
- Nhập thông tin người nhận
- Chọn phương thức thanh toán:
  - 💵 COD (Tiền mặt)
  - 💳 VNPay
  - 💰 MoMo
  - 🔵 ZaloPay
- Xác nhận thông tin cửa hàng
- Ghi chú cho đơn hàng

**Flow:**
```
Giỏ hàng → Đặt hàng → Nhập thông tin → Chọn thanh toán → Xác nhận
```

---

### 3. 🎉 **Xác Nhận Đặt Hàng Thành Công**
- Hiển thị mã đơn hàng
- Thời gian chuẩn bị dự kiến
- Thông tin cửa hàng & người nhận
- Tổng tiền & trạng thái thanh toán

**Hai loại:**
- **COD:** Thanh toán khi nhận → Nút "Về trang chủ"
- **Online:** Chưa thanh toán → Nút "Thanh toán ngay" + "Về trang chủ"

---

### 4. 🔐 **Đăng Nhập / Đăng Ký (Login)**

#### **Đăng Nhập:**
- Tên đăng nhập
- Mật khẩu
- Social login (Google, Apple)

#### **Demo Accounts:**
```
Username: member01
Password: 123456789
→ Hạng Silver, 120 điểm

Username: member02  
Password: 123456789
→ Hạng Gold, 300 điểm
```

#### **Đăng Ký:**
- Họ và tên
- Tên đăng nhập (tối thiểu 4 ký tự)
- Email
- Số điện thoại (10 số, bắt đầu bằng 0)
- Mật khẩu (tối thiểu 6 ký tự)

**Cách mở:**
- Vào trang "Tôi" → Click "Đăng nhập để nhận ưu đãi"

---

## 🎫 MÃ GIẢM GIÁ (VOUCHERS)

### Danh sách voucher có sẵn:

| Mã | Tên | Giảm | Điều kiện |
|---|---|---|---|
| **SALE10** | Giảm 10% | 10% (tối đa 30k) | Đơn từ 100k |
| **BUY2GET1** | Mua 2 tặng 1 | Tối đa 20k | Đơn từ 50k |
| **NEWUSER50** | Giảm 50% ly đầu | 50% (tối đa 50k) | Không giới hạn |

**Cách sử dụng:**
1. Thêm sản phẩm vào giỏ
2. Vào giỏ hàng
3. Click "Chọn mã giảm giá"
4. Chọn voucher phù hợp
5. Tiếp tục đặt hàng

---

## 📊 DỮ LIỆU TỪ SQL DATABASE

### Cấu trúc dữ liệu theo SQL Schema:

#### **Products** (Sản phẩm):
- ✅ 15 món từ bảng `Products`
- ✅ Categories: Trà Sữa, Teaspresso, Trà Nguyên Bản, Snow Cap
- ✅ Giá hiển thị (`display_price`)
- ✅ Mô tả (`descriptionU`)

#### **Branches** (Chi nhánh):
- ✅ 21 cửa hàng từ bảng `Branches`
- ✅ Địa chỉ đầy đủ
- ✅ Thời gian chuẩn bị

#### **Vouchers**:
- ✅ Mã giảm giá từ bảng `Vouchers`
- ✅ Logic tính giảm theo SQL

#### **Orders** (Đơn hàng):
- ✅ Cấu trúc giống bảng `Orders`
- ✅ Lưu: customer info, payment method, voucher

---

## 🚀 WORKFLOW SỬ DỤNG

### Flow hoàn chỉnh từ chọn món → thanh toán:

```
1. Trang chủ
   ↓
2. Chọn cửa hàng
   ↓
3. Vào Thực đơn
   ↓
4. Chọn sản phẩm → Tùy chỉnh (size, đường, đá, topping)
   ↓
5. Thêm vào giỏ (lặp lại nếu muốn thêm món)
   ↓
6. Vào Giỏ hàng 🛍️
   ↓
7. Điều chỉnh số lượng / Áp voucher
   ↓
8. Đặt hàng
   ↓
9. Nhập thông tin người nhận
   ↓
10. Chọn phương thức thanh toán
    ↓
11. Xác nhận đơn
    ↓
12. Màn hình đặt hàng thành công!
    ↓
13a. Nếu Online Payment → "Thanh toán ngay"
13b. Nếu COD → "Về trang chủ"
```

---

## 🎨 RESPONSIVE DESIGN

### Mobile (< 768px):
- ✅ Bottom navigation 4 tab
- ✅ Floating cart button
- ✅ Full-screen modals
- ✅ Touch-friendly UI

### Desktop (≥ 768px):
- ✅ Sidebar navigation
- ✅ Multi-column layout
- ✅ Modal dialogs
- ✅ Hover effects

---

## 🔌 KẾT NỐI SQL SERVER (Sau khi export)

### Để kết nối backend thật:

```javascript
// Backend API (Node.js/Express example)
const sql = require('mssql');

// GET Products
app.get('/api/products', async (req, res) => {
  const result = await sql.query`SELECT * FROM Products`;
  res.json(result.recordset);
});

// GET Branches
app.get('/api/branches', async (req, res) => {
  const result = await sql.query`SELECT * FROM Branches`;
  res.json(result.recordset);
});

// POST Order
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, items, total, paymentMethod } = req.body;
  
  await sql.query`
    INSERT INTO Orders (order_id, member_username, payment_method, total_price, statusU)
    VALUES (${orderId}, ${username}, ${paymentMethod}, ${total}, 'Pending')
  `;
  
  res.json({ success: true, orderId });
});
```

---

## 📝 NOTES

### Mock Data hiện tại:
- ❌ Chưa có API thật
- ✅ Tất cả data lưu trong React state (mất khi reload)
- ✅ Demo accounts để test login

### Khi có Backend:
- Thay `useState` → API calls
- Connect SQL Server
- Implement authentication
- Payment gateway integration

---

## 🎯 DEMO SCENARIOS

### Scenario 1: User mới đăng ký
```
1. Vào "Tôi" → Đăng nhập
2. Chọn tab "Đăng ký"
3. Điền form đăng ký
4. → Tự động login, nhận 0 điểm
```

### Scenario 2: Đặt món với voucher
```
1. Login với member01
2. Chọn 2 món trà sữa (>100k)
3. Vào giỏ → Áp mã SALE10
4. Checkout → Chọn VNPay
5. → Hiện nút "Thanh toán ngay"
```

### Scenario 3: Order COD
```
1. Guest user (không login)
2. Chọn món
3. Checkout → Chọn COD
4. → Về trang chủ luôn
```

---

**Chúc bạn test vui vẻ! 🎉**

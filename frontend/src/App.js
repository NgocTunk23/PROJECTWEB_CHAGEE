// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

// --- Component Trang chủ User (Logic cũ của bạn được chuyển vào đây) ---
const UserHome = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  useEffect(() => {
    // Lấy token từ storage để đính kèm vào header (nếu backend yêu cầu)
    const token = localStorage.getItem('access_token');
    
    fetch('http://localhost:8080/api/products', {
      headers: {
        'Authorization': `Bearer ${token}` // Thêm token vào request nếu cần
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Lỗi kết nối:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Menu Chagee (User)</h1>
        <button onClick={handleLogout} style={{padding:'5px 10px', background:'red', color:'white'}}>Đăng xuất</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.length > 0 ? products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{p.name}</h3>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{p.price} VNĐ</p>
            <p style={{ fontSize: '0.9em' }}>{p.description}</p>
          </div>
        )) : <p>Không có sản phẩm hoặc chưa đăng nhập đúng cách.</p>}
      </div>
    </div>
  );
};

// --- Component Trang Admin (Ví dụ đơn giản) ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{padding: 20}}>
      <h1>Admin Dashboard</h1>
      <p>Chào mừng quản trị viên. Tại đây bạn có thể quản lý sản phẩm, đơn hàng...</p>
      <button onClick={() => {
         localStorage.clear();
         navigate('/login');
      }}>Đăng xuất</button>
    </div>
  );
};

// --- App Component Chính (Chứa Router) ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route công khai: Mặc định vào Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route dành cho ADMIN */}
        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Route dành cho CUSTOMER (và cả ADMIN, STAFF nếu muốn) */}
        <Route element={<PrivateRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']} />}>
          <Route path="/home" element={<UserHome />} />
        </Route>

        {/* Route xử lý khi nhập sai đường dẫn */}
        <Route path="*" element={<div style={{padding:20}}>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
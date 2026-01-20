// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');

    // 1. Chưa đăng nhập -> đá về login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Đã đăng nhập nhưng sai quyền -> đá về trang lỗi hoặc login
    // (Nếu allowedRoles không truyền vào thì coi như route đó chỉ cần login là được)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Ví dụ: User thường cố vào trang Admin
        alert("Bạn không có quyền truy cập trang này!");
        return <Navigate to="/login" replace />;
    }

    // 3. Hợp lệ -> Cho hiện nội dung bên trong (Outlet)
    return <Outlet />;
};

export default PrivateRoute;
// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Bạn có thể copy css từ file cũ hoặc tạo mới tùy ý

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Gọi API login của Spring Boot
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Lưu token và role vào localStorage
        // Lưu ý: data.token và data.role phải khớp với JSON trả về từ AuthController.java
        localStorage.setItem('access_token', data.token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_name', data.username);

        // 2. Điều hướng dựa trên Role
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          // Khách hàng hoặc nhân viên thì về trang chủ
          navigate('/home');
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối đến server');
    }
  };

  return (
    <div className="login-container" style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Đăng nhập Chagee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Tài khoản (Username):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API từ Java Backend (Cổng 8080)
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Lỗi kết nối:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Menu Chagee - Dữ liệu từ SQL Server</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{p.name}</h3>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{p.price} VNĐ</p>
            <p style={{ fontSize: '0.9em' }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
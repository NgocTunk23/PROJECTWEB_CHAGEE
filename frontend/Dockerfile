# Sử dụng Node để chạy dev server
FROM node:18-alpine

WORKDIR /app

# Copy file dependency trước
COPY package.json package-lock.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Mở port (phải khớp với docker-compose)
EXPOSE 3001

# Lệnh chạy mặc định
# Thêm --host để Docker mở kết nối ra ngoài
# Thêm --port 3001 để ép chạy đúng port
CMD ["npm", "run", "dev", "--", "--host", "--port", "3001"]
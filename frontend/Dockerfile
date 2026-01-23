# 1. Dùng Node.js để chạy
FROM node:20-alpine

# 2. Tạo thư mục làm việc
WORKDIR /app

# 3. Copy file quản lý thư viện vào trước (để tận dụng cache)
# COPY package*.json ./ BẢN CŨ
COPY package.json package-lock.json ./

# 4. Cài đặt thư viện
RUN npm install

# 5. Copy toàn bộ code Frontend vào
COPY . .

# 6. Mở cổng 3000
EXPOSE 3001

# 7. Lệnh chạy React BẢN CŨ
# CMD ["npm", "start"]s


# 7. Lệnh chạy Vite
CMD ["npm", "run", "dev"]
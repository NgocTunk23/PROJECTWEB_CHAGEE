# TẮT DOCKER
docker-compose down
# BUILD DOCKER
docker-compose up --build
# DÀNH ĐỌC LOG
docker-compose up

# FOR WSL
docker exec -i sql_container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password123!" -C < ./database/init_db.sql
# FOR MAC
docker exec -i sql_container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Password123!' -C < ./database/init_db.sql

# KHỞI ĐỘNG BE
docker restart backend_container

# CHỈ ĐỌC LOG CỦA BE
docker logs -f backend_container



cd backend
./mvnw spring-boot:run
cd frontend
npm start

# LINK CHẠY WEB
http://localhost:3001/

docker-compose down
docker-compose up --build

docker exec -i sql_container /opt/mssql-tools18/bin/sqlcmd \
-S localhost -U sa -P "Password123!" -C < ./database/init_db.sql

docker restart backend_container




cd backend
./mvnw spring-boot:run
cd frontend
npm start

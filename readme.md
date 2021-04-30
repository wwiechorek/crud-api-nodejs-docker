# NodeJS Simple CRUD API-rest Bill
It`s a simple CRUD restfull API make in NodeJS

### Description
Using MySQL as database
Using Mysql2 library drive connector
Using promises to fetch db data 
Using containers docker to run dev and prod

Postman API file: API.postman_colllection.json

### Run
Copy .env.sample to .env

Run:
docker-compose up

Import db:
Command:
docker exec -i <container_db_name> mysql -uroot -p<db_root> bill < shared/dump.sql

Ex (using .env.sample):
docker exec -i nodejs_api_db mysql -uroot -p123456 bill < shared/dump.sql

Author: William Wiechorek
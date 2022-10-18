CREATE TABLE IF NOT EXISTS users(
    id  VARCHAR(100) PRIMARY KEY ,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);
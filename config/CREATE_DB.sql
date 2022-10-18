CREATE TABLE IF NOT EXISTS users(
    id  VARCHAR(100) PRIMARY KEY ,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS user_following (
   u_id VARCHAR(100) NOT NULL,
   following_id  VARCHAR(100) NOT NULL ,
   PRIMARY KEY (u_id, following_id),
   INDEX(u_id),
   FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE
);
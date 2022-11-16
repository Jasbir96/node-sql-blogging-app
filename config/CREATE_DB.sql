CREATE TABLE IF NOT EXISTS users(
    id  VARCHAR(100) PRIMARY KEY ,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS user_following (
   u_id VARCHAR(100) NOT NULL,
   following_id  VARCHAR(100) NOT NULL,
   PRIMARY KEY (u_id, following_id),
   INDEX(u_id),
   FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(100) PRIMARY KEY,
    author_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL UNIQUE,
    sub_title VARCHAR(200) NOT NULL,
    body VARCHAR(255) NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   slug VARCHAR(255) NOT NULL UNIQUE,
   FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
   INDEX (author_id)
);

CREATE TABLE IF NOT EXISTS article_tags(
a_slug VARCHAR(100) NOT NULL,
name VARCHAR(100) NOT NULL,
FOREIGN KEY (a_slug) REFERENCES articles(slug) ON DELETE CASCADE,
PRIMARY KEY (a_slug,name),
INDEX (name)
);


CREATE TABLE IF NOT EXISTS likes (
   u_id VARCHAR(100) NOT NULL,
   article_slug  VARCHAR(100) NOT NULL ,
   PRIMARY KEY (u_id, article_slug),
   INDEX(article_slug),
   FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (article_slug) REFERENCES articles(slug) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS comments (
   id VARCHAR(100) PRIMARY KEY,
   u_id VARCHAR(100) NOT NULL,
   article_slug  VARCHAR(100) NOT NULL,
   content VARCHAR(255) NOT NULL,
   INDEX(article_slug),
   FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (article_slug) REFERENCES articles(slug) ON DELETE CASCADE
);
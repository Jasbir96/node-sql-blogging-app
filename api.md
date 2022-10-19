
## API Endpoints 

### `POST /users` 
create a new user 

### `POST /users/login` 

### `GET /profiles`📄

### `GET /profiles/{username}` 


### `GET /articles` 📄
get all articles (default page size 10)
available filters 

- `/articles?tag=stocks`
- `/articles?author=arnavg`
- `/articles?page=3&size=10`

### `GET /articles/{article-slug}`

### `POST /articles` 🔐
create a new article 

### `PATCH /articles/{article-slug}` 🔐👤
edit an article 


### `GET /article/{article-slug}/comments` 📄 
get all comments of an article 

### `POST /article/{article-slug}/comments` 🔐

### `DELETE /article/{article-slug}/comments/{comment-id}` 🔐👤



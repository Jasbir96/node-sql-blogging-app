<span align=left>
  <img src="https://cdn.freebiesupply.com/logos/thumbs/2x/nodejs-1-logo.png" alt="node-js-logo" height=400 width=400>
</span>
<span align=right>
  <img src="https://cdn.freebiesupply.com/logos/large/2x/mysql-logo-png-transparent.png" alt="node-js-logo" height=400 width=400>
</span>

# BLOGGING APP

## Description
A web application for blogging which has built in capabilities to handle various users. where users can create blogs, like them comment them and follow each other. 

### Pre-setup dependencies

- Git
- Node.js
- npm
- XAMPP 

### Setup

`HTTPS`

```bash
git clone https://github.com/Jasbir96/node-sql-blogging-app.git
```

`SSH`

```bash
git clone git@github.com:Jasbir96/node-sql-blogging-app.git
```

`dependencies`

```bash
npm install
```

### Env Variables
create .env file in the root and add the following
```
HOST=localhost
USER=root
PASSWORD=""
DATABASE=blogging_app
JWT_SECRET=YOUR_SECRET
```
### Setup Database
- create blogging_app DB in phpMyAdmin
- copy sql script [here](config/CREATE_DB.sql) and execute this sql code inside your that blogging_app DB

### Usage

`production`

```bash
npm start
```

`development`

```bash
npm run dev
```

`testing`

```bash
npm run test
```

Refer API Usage [here](https://documenter.getpostman.com/view/24376193/2s8YeprsFB).
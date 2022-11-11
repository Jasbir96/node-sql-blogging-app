const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect(function (err,resp){
    if(err){
        console.error(err);
    }else{
        console.log(resp);
    }
});
module.exports = connection;
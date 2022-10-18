const connection = require("../config/connection");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
// create
const create = async (userObj) => {
    // insert 
    userObj.id = uuidv4();
    userObj.password = await bcrypt.hash(userObj.password, 10);
    userObj.confirmPassword = undefined;
    // create user 
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO users SET ?`, userObj, function (err, res) {
            if (err) {
                reject(err)
                return;
            } else {
                resolve(res);
            }
        })
    })
}
module.exports.create = create;
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
const getByEntity = (searchObj) => {
    let searchString = '';
    for (let attr in searchObj) {
        console.log(searchObj[attr]);
        searchString += `${attr}="${searchObj[attr]}", `
    }
    // to remove extra comma
    searchString = searchString.substring(0, searchString.length - 2);
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from users WHERE ${searchString}}`,
            function (err, res) {
                if (err) {
                    reject(err)
                    return;
                } else {
                    resolve(res[0]);
                }
            })
    })
}
module.exports.create = create;
module.exports.getByEntity = getByEntity;
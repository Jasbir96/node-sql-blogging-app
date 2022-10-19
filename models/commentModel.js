const connection = require("../config/connection");
const { v4: uuidv4 } = require('uuid');

// create
const create = async (uid, articleSlug) => {
    // insert 
    const id = uuidv4(); 
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO comments SET id=${id} 
        article_slug=${articleSlug} ,u_id=${uid}`,
            function (err, res) {
                if (err) {
                    reject(err)
            
                } else {
                    resolve(res);
                }
            })
    })
}

module.exports.create=create;

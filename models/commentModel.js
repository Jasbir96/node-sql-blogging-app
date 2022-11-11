const connection = require("../config/connection");
const { v4: uuidv4 } = require('uuid');

// create
const create = async (articleSlug,uid,content) => {
    // insert 
    const id = uuidv4(); 
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO comments SET id="${id}", article_slug="${articleSlug}", u_id="${uid}", content="${content}"`,
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
    })
}
const getAllCommentsOfArticle = async (searchObj) => {
    const page = searchObj.page ;
   delete searchObj.page; 
    const size = searchObj.size ;
    delete searchObj.size;
    const offset = (page - 1) * size;
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from comments WHERE article_slug="${searchObj.articleSlug}"
        LIMIT ${size} OFFSET ${offset}`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            })
    })
}
const deleteCommentOfArticle = async (id) => {
    return new Promise(function (resolve, reject) {
        connection.query(`DELETE from comments WHERE id = "${id}"`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
    })
}
const updateCommentOfArticle = async (id,content) => {
     return new Promise(function (resolve, reject) {
        connection.query(`UPDATE  comments SET content ="${content}" WHERE id = "${id}"`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
    })
}
module.exports.create=create;
module.exports.getAllCommentsOfArticle=getAllCommentsOfArticle;
module.exports.deleteCommentOfArticle=deleteCommentOfArticle;
module.exports.updateCommentOfArticle=updateCommentOfArticle;


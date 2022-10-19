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
const getAllCommentsOfArticle = async (searchObj) => {
    const page = searchObj.page ;
    searchObj.page = undefined;
    const size = searchObj.size ;
    searchObj.size = size;
    const offset = (page - 1) * size;
    return new Promise(function (resolve, reject) {
        connection
        .query
        (`SELECT * from comments WHERE article_slug=${searchObj.articleSlug}
        AND LIMIT ${size} OFFSET ${offset}`,
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
        connection.query(`DELETE from comments WHERE id = ${id}`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
    })
}
const updateCommentOfArticle = async (id,toUpdateObject) => {
    let updateString = '';
    // tags are removed 
    let tags = toUpdateObject.tags;
    toUpdateObject.tags = undefined;
    // console.log(toUpdateObject);
    for (let attr in toUpdateObject) {
        console.log(toUpdateObject[attr]);
        updateString += `${attr}="${toUpdateObject[attr]}", `
    }
    updateString = updateString.substring(0,updateString.length - 2);
     return new Promise(function (resolve, reject) {
        connection.query(`UPDATE  comments SET ${updateString} WHERE id = ${id}`,
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


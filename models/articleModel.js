const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const connection = require("../config/connection");


const create = async (articleObj) => {
     // insert 
    articleObj.id = uuidv4();
    articleObj.slug = slug(articleObj.title);
    // create user 
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO articles SET ?`, articleObj, function (err, res) {
            if (err) {
                reject(err)
                return;
            } else {
                // insert tags in article_tags db 
                let article = res;
                const entries = [];
                for (let i = 0; i < articleObj.tags.length; i++) {
                    let tag = articleObj.tags[i];
                    entries.push([articleObj.slug, tag]);
                }
                const tagsTableSql = "INSERT INTO article_tags (a_slug,name) VALUES ?";
                connection.query(tagsTableSql, entries, function (err, res) {
                    if (err) {
                        reject(err);
                
                    } else {
                        article.tags = res
                        resolve(article);
                    
                    }
                })

            }
        })
    })
}
const getByEntity = (searchObj) => {
    // console.log(uid);
    let searchString = '';
    // console.log(toUpdateObject);
    for (let attr in searchObj) {
        console.log(searchObj[attr]);
        searchString += `${attr} = "${searchObj[attr]}", `
    }
    searchString = searchString.substring(0, searchString.length - 2);
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from articles WHERE ${searchString}} `,
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
module.exports.create=create;
module.exports.getByEntity=getByEntity;
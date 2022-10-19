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
module.exports.create=create;
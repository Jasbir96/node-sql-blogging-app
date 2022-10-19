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
const getAll = (searchObj) => {
    const page = searchObj.page||1
    searchObj.page = undefined;
    const size = searchObj.size||2
    searchObj.size = size;
    let tags = searchObj.tags || [];
    tags = "(" + tags.join(",") + ")";
    searchObj.tags = undefined;
    for (let attr in searchObj) {
        console.log(searchObj[attr]);
        searchString += `${attr} = "${searchObj[attr]}", `
    }
    searchString = searchString.substring(0, searchString.length - 2);
    return new Promise(function (resolve, reject) {
        let slugArr = [];
        connection.query(`SELECT a_slug from  article_tags WHERE name IN ${tags}`,
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    slugArr = "(" + res.join(",") + ")";
                    let queryString = "";
                    const offset = (page - 1) * size;
                    if (res.length > 0) {
                        queryString = ` AND slug IN ${slugArr} `;
                    }
                    connection.query(`SELECT * from articles WHERE ${searchString} 
                    ${queryString} AND LIMIT ${size} OFFSET ${offset}
                    `,
                        function (err, res) {
                            if (err) {
                                reject(err)
                                return;
                            } else {
                                resolve(res[0]);
                            }
                        })
                }
            })
    })
}
const updateBySlug = (slug, toUpdateObject) => {
    
    let updateString = '';
    // tags are removed 
    let tags = toUpdateObject.tags;
    toUpdateObject.tags = undefined;
    
    for (let attr in toUpdateObject) {
        console.log(toUpdateObject[attr]);
        updateString += `${attr}="${toUpdateObject[attr]}", `
    }
    updateString = updateString.substring(0,updateString.length - 2);
    return new Promise(function (resolve, reject) {
        connection.query(`UPDATE articles SET ${updateString} WHERE slug="${slug}"`,
            function (err, result) {
                if (err) {
                    // console.log(err);
                    reject(err)
                } else {
                    // remove
                    connection.query(`DELETE from article_tags WHERE a_slug="${slug}"`, function (err, result) {
                        if (err) {
                            reject(err);

                        } else {
                            const entries = [];
                            for (let i = 0; i < tags.length; i++) {
                                let tag = tags[i];
                                entries.push([articleObj.slug, tag]);
                            }
                            const tagsTableSql = "INSERT INTO article_tags (a_slug,name) VALUES ?";
                            connection.query(tagsTableSql, entries, function (err, res) {
                                if (err) {
                                    reject(err);
                                    return;
                                } else {
                                    article.tags = res
                                    resolve(article);
                                    return;
                                }
                            })
                        }
                    })

                    
                }
            });
    })
}
const deleteBySlug = (slug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`DELETE from articles WHERE slug = ${slug}`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
    })
}
const feed = (userId, page, size) => {
    const page = searchObj.page || 1;
    const size = searchObj.size || 10;
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT following_id from user_following WHERE
        u_id=${userId}`, function (err, result) {
            if (err) {
                reject(err);
            } else {
                let followingArr = "(" + result.join(",") + ")";
                let offset = (page - 1) * size
                connection.query(`SELECT * from articles WHERE author_id IN ${followingArr}
                LIMIT ${size} OFFSET ${offset}
                `, function (err, res) {
                    if (res.length == size) {
                        resolve(res);
                    } else if (res.length != 0) {
                        // rest get kar lo aur append kr do 
                        connection.query(`SELECT * from articles WHERE author_id NOT IN ${followingArr}
                                    LIMIT ${size - res.length}`, function (err, respub) {
                            resolve([...res, ...respub,]);
                        });
                    } else {
                        // page: 3
                        connection.query(`SELECT COUNT(*) from articles WHERE author_id NOT IN ${followingArr}`, function (err, res) {
                            let actualOffset = (page - 1) * size;
                            let offsetForNonFollowing = actualOffset - res;
                            connection.query(`SELECT * from articles WHERE author_id NOT IN ${followingArr}
                        LIMIT ${size} OFFSET ${offsetForNonFollowing}`, function (err, res) {
                                resolve(res);
                            });
                        })
                    }
                })

            }
        })
    })
}

module.exports.create=create;
module.exports.getByEntity=getByEntity;
module.exports.getAll=getAll;
module.exports.updateBySlug=updateBySlug;
module.exports.deleteBySlug=deleteBySlug;
module.exports.feed=feed;
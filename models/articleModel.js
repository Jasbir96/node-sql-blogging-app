const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const connection = require("../config/connection");


const create = async (articleObj) => {
    // insert 
    articleObj.id = uuidv4();
    articleObj.slug = slug(articleObj.title);
    const tags = articleObj.tags;
    delete articleObj.tags
    // create user 
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO articles SET ?`, articleObj, function (err, res) {
            if (err) {
                reject(err)
                return;
            } else {
                // insert tags in article_tags db 
                const entries = [];
                for (let i = 0; i < tags.length; i++) {
                    let tag = tags[i];
                    entries.push([articleObj.slug, tag]);
                }
                const tagsTableSql = "INSERT INTO article_tags (a_slug,name) VALUES ?";
                connection.query(tagsTableSql, [entries], function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })

            }
        })
    })
}
const getByEntity = (searchObj) => {
    let searchString = '';
    for (let attr in searchObj) {
        searchString += `${attr} = "${searchObj[attr]}", `
    }
    searchString = searchString.substring(0, searchString.length - 2);
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from articles WHERE ${searchString} `,
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
const getAll = async (searchObj) => {
    const page = searchObj.page || 1;
    delete searchObj.size;
    const size = searchObj.size || 10;
    delete searchObj.size;
    const offset = (page - 1) * size
    let tags = searchObj.tags;
    delete searchObj.tags;
    let toFilterContent = Object.keys(searchObj).length > 0;
    let areTagsAvailable = tags.length > 0;
    // filtering results
    let searchString = "";
    if (toFilterContent) {
        for (let attr in searchObj) {
            searchString += `${attr} = "${searchObj[attr]}",`
        }
        searchString = searchString.substring(0, searchString.length - 1);
        searchString = searchString
    }

    const articleSlugs = await getslugsFromTagsHelper(tags);
    let tagsString = "";

    if (areTagsAvailable) {
        const articleSlugString = inClauseTransformHelper(articleSlugs, "a_slug");
        tagsString = `slug IN ${articleSlugString} `;
    }
    let queryString = "";
    if (toFilterContent == false && areTagsAvailable == false) {
        queryString = `SELECT * from articles LIMIT ${size} OFFSET ${offset}`;
    } else if (toFilterContent == true && areTagsAvailable == true) {
        queryString = `SELECT * from articles WHERE ${searchString} AND ${tagsString} LIMIT ${size} OFFSET ${offset}`;
    } else if (toFilterContent == false && areTagsAvailable == true) {
        queryString = `SELECT * from articles WHERE  ${tagsString} LIMIT ${size} OFFSET ${offset}`;
    } else {
        queryString = `SELECT * from articles WHERE ${searchString}  LIMIT ${size} OFFSET ${offset}`;

    }
    return new Promise((resolve, reject) => {
        connection.query(queryString,
            function (err, res) {
                if (err) {
                    reject(err)
                    return;
                } else {
                    resolve(res);
                }
            })
    })

}
const getslugsFromTagsHelper = (tags) => {

    return new Promise(function (resolve, reject) {
        if (tags.length == 0) {
            resolve([]);
            return;
        }
        connection.query(`SELECT a_slug from article_tags WHERE name IN (?) `, [tags],
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);

                }
            })
    })
}
const updateBySlug = async (articleSlug, toUpdateObject) => {
    // tags are removed 
    let tags = toUpdateObject.tags || [];
    delete toUpdateObject.tags;
    const somethingToUpdate = Object.keys(toUpdateObject).length > 0;
    const tagsToUpdate = tags.length > 0;
    if (somethingToUpdate) {
        let updateString = '';
        for (let attr in toUpdateObject) {
            updateString += `${attr}="${toUpdateObject[attr]}",`
        }
        updateString = updateString.substring(0, updateString.length - 1);
        await updateArticleHelper(updateString, articleSlug);
    }
    if (tagsToUpdate) {
        await updateTagsHelper(tags, articleSlug);
    }

}
const updateArticleHelper = (updateString, articleSlug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`UPDATE articles SET ${updateString} WHERE slug="${articleSlug}"`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve();

                }
            });
    })
}
const updateTagsHelper = (tags, articleSlug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`DELETE from article_tags WHERE a_slug="${articleSlug}"`, function (err, result) {
            if (err) {
                reject(err);
            } else {
                const entries = [];
                for (let i = 0; i < tags.length; i++) {
                    let tag = tags[i];
                    entries.push([articleSlug, tag]);
                }


                const tagsTableSql = "INSERT INTO article_tags (a_slug,name) VALUES ?";
                connection.query(tagsTableSql, [entries], function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            }
        })
    });


}
const deleteBySlug = (slug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`DELETE from articles WHERE slug = "${slug}"`,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(`DELETE from article_tags WHERE a_slug="${slug}"`, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    })
                }
            });
    })
}
const feed = (userId, page, size) => {
    page = page || 1;
    size = size || 10;
    return new Promise(function (resolve, reject) {
        // if doen't follow anyone wala case 
        connection.query(`SELECT following_id from user_following WHERE u_id="${userId}"`, function (err, result) {
            if (err) {
                reject(err);
            } else {

                if (result.length == 0) {
                    let offset = (page - 1) * size;
                    connection.query(`SELECT * from articles ORDER BY created_at DESC
                                         LIMIT ${size} OFFSET ${offset}
                                         
                                         `, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });

                }
                else {
                    let offset = (page - 1) * size;
                    const followingArrString = inClauseTransformHelper(result, "following_id");
                    connection.query(`SELECT * from articles WHERE author_id IN ${followingArrString} ORDER BY created_at DESC LIMIT ${size} OFFSET ${offset}`, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        else if (res.length == size) {
                            resolve(res);
                        } else if (res.length != 0) {
                            // rest get kar lo aur append kr do
                            connection.query(`SELECT * from articles WHERE author_id NOT IN ${followingArrString}
                            ORDER BY created_at DESC
                                    LIMIT ${size - res.length} OFFSET ${offset}
                                    `, function (err, respub) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve([...res, ...respub,]);
                            });
                        } else {
                            // page: 3

                            connection.query(`SELECT COUNT(*) from articles WHERE author_id NOT IN ${followingArrString} `, function (err, res) {
                                if (err) {
                                    reject(err);
                                }
                                let actualOffset = (page - 1) * size;
                                let offsetForNonFollowing = actualOffset - res.length;
                                connection.query(`SELECT * from articles WHERE author_id NOT IN ${followingArrString}
                                ORDER BY created_at DESC   LIMIT ${size} OFFSET ${offsetForNonFollowing} `, function (err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    resolve(res);
                                });
                            })
                        }
                    })
                }


            }
        })
    })
}
const like = (userId, articleSlug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO likes SET u_id = "${userId}", article_slug = "${articleSlug}" `,
            function (err, result) {
                if (err) {

                    reject(err)
                    return;
                } else {
                    resolve(result);
                }
            });
    })
}
const dislike = (userId, articleSlug) => {
    return new Promise(function (resolve, reject) {
        connection.query(`DELETE  FROM likes 
        WHERE u_id = "${userId}" AND article_slug = "${articleSlug}" `,
            function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
    })
}
const inClauseTransformHelper = (arr, key) => {
    let arraySlugString = "(";
    for (let i = 0; i < arr.length; i++) {
        arraySlugString += '"' + arr[i][key] + '"' + ","
    }
    arraySlugString = arraySlugString.substring(0, arraySlugString.length - 1);
    arraySlugString += ")";
    return arraySlugString
}
module.exports.create = create;
module.exports.getByEntity = getByEntity;
module.exports.getAll = getAll;
module.exports.updateBySlug = updateBySlug;
module.exports.deleteBySlug = deleteBySlug;
module.exports.feed = feed;
module.exports.like = like;
module.exports.dislike = dislike;
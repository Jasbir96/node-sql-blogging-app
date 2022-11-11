const articleModel = require("../models/articleModel");
const commentModel = require("../models/commentModel");

const createArticleController = async function (req, res) {
    try {
       
        if(req.body.title===undefined||
            req.body.body===undefined||
            req.body.sub_title===undefined||
            req.body.tags===undefined)
            {
            res.status(400)
            .json({
                        status: "failure",
                        message:"some required fields are missing"
                    })   
            return;
                }
        const article = await articleModel.create({
            title: req.body.title,
            body: req.body.body,
            sub_title: req.body.sub_title,
            author_id: req.userId,
            tags: req.body.tags
        })
        res.status(201).json({
            status: "success",
            message:"article created successfully"
        });
    } catch (err) {
        return res.status(500).json({
            status:"failure",
            err:err.message
        });
    }
}
const getArticleBySlugController = async function (req, res) {
    try {
        const articleSlug = req.params["article_slug"];
        const article = await articleModel.getByEntity({ slug: articleSlug });
        if (article == null) {
            res.status(404).json({
                status: "failure",
                data: "article not found"
            })
        } else {
            res.status(200).json({
                status: "success",
                data: article
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const getAllArticles = async function (req, res) {
    try {
      req.query.tags= req.query.tags==undefined?[]: req.query.tags.split(",");
        const articles = await articleModel.getAll(req.query);
        if (articles == null) {
            res.status(404).json({
                status: "failure",
                data: "articles not found"
            })
            return;
        }
        res.status(200).json({
            status: "success",
            data: articles
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const updateArticleController = async function (req, res) {
    try {
        let updateObj = req.body;
        let articleSlug = req.params["article_slug"];
        // if user want to update id or nothing to update 
        if (Object.keys(updateObj).length == 0||updateObj.title!=undefined) {
            return res.status(400).json({
                status:"failure",
                data:"invalid request"
            })
        }
        await articleModel.updateBySlug(articleSlug,updateObj);
        res.status(200).json({
            status: "success",
            data: "article successfully updated"
        })
    }
    catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const deleteArticleController = async function (req, res) {
    try {
        let articleSlug = req.params["article_slug"];
         await articleModel.deleteBySlug(articleSlug);
        res.status(200).json({
            status: "success",
            data: "article deleted successfully"
        })
    } catch (err) {
        return res.status(500).json({
            status: "failure",
            err: err.message
        });
    }
}
const feedController = async function (req, res) {
    try {
       const page = req.query.page || 1;
       const size = req.query.size || 10;
       const userId=req.userId;
        const articles = await articleModel.feed(userId,page,size);
        if(articles.length==0) {
            res.status(404).json({
                status: "failure",
                data: "articles not found"
            })
            return;
        }
        res.status(200).json({
            status: "success",
            data: articles
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const likeArticleController = async function (req, res) {
    try {
        let userId = req.userId;
        // the user i want to follow;
        let articleSlug = req.params["article_slug"];
        await articleModel.like(userId, articleSlug);
        res.status(201).json({
            status: "success",
            result: "you are have now liked the post"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const dislikeArticleController = async function (req, res) {
    try {
        let userId = req.userId;
        let articleSlug = req.params["article_slug"];

        await articleModel.dislike(userId, articleSlug);
        res.status(200).json({
            status: "success",
            result: "you are have now disliked the post"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
// **************comments section****************
const createCommentController = async function (req, res) {
    try {
        const articleSlug = req.params["article_slug"];
        const userId = req.userId;
        const content =req.body.content;
        await commentModel.create(articleSlug, userId,content);
        res.status(200).json({
            status: "success",
            result: "comment created successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const articleAllCommentsController = async function (req, res) {
    try {
        let articleSlug = req.params["article_slug"];
        let page = req.query.page||1;
        let size = req.query.size||10;
        const searchObj = { articleSlug, page, size };
        const comments = await commentModel.getAllCommentsOfArticle(searchObj);
            if(comments.length==0){
                       res.status(404).json({
                        status: "failure",
                        message: "No comments were found"
                       }) 
                return;
            }

        res.status(200).json({
            status:"success",
            message:comments
        })


    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const deleteCommentController = async function (req, res) {
    try {
        let commentId = req.params["comment_id"];
        
            await commentModel.deleteCommentOfArticle(commentId);
        res.status(200).json({
            status: "success",
            data:  "comment updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}

const updateCommentController = async function (req, res) {
    try {
        let commentId = req.params["comment_id"];
        await commentModel.updateCommentOfArticle(commentId,req.body.content);
        res.status(200).json({
            status: "success",
            data: "comment updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}

module.exports ={
    createArticleController,
    getArticleBySlugController,
    getAllArticles,
    updateArticleController,
    deleteArticleController,
    feedController,
    likeArticleController,
    dislikeArticleController,
    createCommentController,
    articleAllCommentsController,
    deleteCommentController,
    updateCommentController
}

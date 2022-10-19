const articleModel = require("../models/articleModel");

const createArticleController = async function (req, res) {
    try {
        if(req.body.title===undefined||
            req.body.body===undefined||
            req.body.sub_title===undefined||
            req.body.author_id===undefined||req.body.tags===undefined)
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
            author_id: req.body.author_id,
            tags: req.body.tags
        })
        res.status(201).json({
            status: "success",
            message:article
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
        const articleSlug = req.params["article-slug"];
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
module.exports ={
    createArticleController,
    getArticleBySlugController
}
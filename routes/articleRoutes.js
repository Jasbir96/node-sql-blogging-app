const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare} = require("../middlewares/auth");
const {createArticleController,
    getArticleBySlugController,
    getAllArticles
} = require("../controllers/articleController");

//****************articles section*****************
articleRouter
    .route("/")
    .post(protectRouteMiddleWare, createArticleController)
    .get(getAllArticles);
articleRouter
    .route('/:article-slug')
    .get(getArticleBySlugController)
module.exports = articleRouter;

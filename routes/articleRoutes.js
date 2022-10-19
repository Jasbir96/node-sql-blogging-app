const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare,identifyIsSameUserMiddleware} = require("../middlewares/auth");
const {createArticleController,
    getArticleBySlugController,
    getAllArticles,updateArticleController
} = require("../controllers/articleController");


//****************articles section*****************
articleRouter
    .route("/")
    .post(protectRouteMiddleWare, createArticleController)
    .get(getAllArticles);
articleRouter
    .route('/:article-slug')
    .get(getArticleBySlugController)
       .patch(protectRouteMiddleWare, identifyIsSameUserMiddleware, updateArticleController)

module.exports = articleRouter;

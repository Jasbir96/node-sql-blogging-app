const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare,identifyIsSameUserMiddleware} = require("../middlewares/auth");
const {createArticleController,
    getArticleBySlugController,
    getAllArticles,updateArticleController,
    deleteArticleController,
    likeArticleController
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
    .delete(protectRouteMiddleWare, identifyIsSameUserMiddleware, deleteArticleController)
// ****************like and dislike section****************
articleRouter.route("/:article-slug/like")
    .post(protectRouteMiddleWare, likeArticleController);

module.exports = articleRouter;

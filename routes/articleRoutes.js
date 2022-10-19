const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare,identifyIsSameUserMiddleware} = require("../middlewares/auth");
const {createArticleController,
    getArticleBySlugController,
    getAllArticles,updateArticleController,
    deleteArticleController,
} = require("../controllers/articleController");
const {likeArticleController,
    dislikeArticleController} =require("../controllers/articleController");
const {articleAllCommentsController,createCommentController,deleteCommentController,
updateCommentController
}=require("../controllers/articleController");
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
articleRouter.route("/:article-slug/dislike")
    .post(protectRouteMiddleWare, dislikeArticleController);
// ****************comments section**********************
articleRouter.route("/:article-slug/comments")
.get(articleAllCommentsController)
    .post(protectRouteMiddleWare,createCommentController);
articleRouter.route("/:article-slug/comments/:comment-id")
.patch(protectRouteMiddleWare, identifyIsSameUserMiddleware, 
        updateCommentController)
    .delete(protectRouteMiddleWare, identifyIsSameUserMiddleware, 
        deleteCommentController);


module.exports = articleRouter;

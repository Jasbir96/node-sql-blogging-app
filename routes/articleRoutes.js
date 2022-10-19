const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare} = require("../middlewares/auth");
const {createArticleController,getArticleBySlugController} = require("../controllers/articleController");

//****************articles section*****************
articleRouter
    .route("/")
    .post(protectRouteMiddleWare, createArticleController);
articleRouter
    .route('/:article-slug')
    .get(getArticleBySlugController)
module.exports = articleRouter;

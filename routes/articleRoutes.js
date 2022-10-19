const express = require('express');
const articleRouter = express.Router();
const { protectRouteMiddleWare} = require("../middlewares/auth");


//****************articles section*****************
articleRouter
    .route("/")
    .post(protectRouteMiddleWare, createArticleController);
module.exports = articleRouter;

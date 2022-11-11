const express = require('express');
const userRouter = express.Router();
const { createUserController ,loginUserController,followUserController,unFollowUserController} = require("../controllers/userController")
const {protectRouteMiddleWare} =require("../middlewares/auth");
userRouter.post("/", createUserController);
userRouter.post("/login", loginUserController);
userRouter.use(protectRouteMiddleWare)
userRouter.post("/follow", followUserController)
userRouter.post("/unfollow", unFollowUserController);


module.exports = userRouter;
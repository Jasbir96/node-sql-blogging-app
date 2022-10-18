const express = require('express');
const userRouter = express.Router();
const { createUserController ,loginUserController,followUserController,unFollowUserController} = require("../controllers/userController")
userRouter.post("/", createUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/follow", followUserController)
userRouter.post("/unfollow", unFollowUserController);


module.exports = userRouter;
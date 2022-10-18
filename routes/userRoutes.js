const express = require('express');
const userRouter = express.Router();
const { createUserController ,loginUserController,followUserController} = require("../controllers/userController")
userRouter.post("/", createUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/follow", followUserController);

module.exports = userRouter;
const express = require('express');
const userRouter = express.Router();
const { createUserController ,loginUserController} = require("../controllers/userController")
userRouter.post("/", createUserController);
userRouter.post("/login", loginUserController);
module.exports = userRouter;
const express = require('express');
const userRouter = express.Router();
const { createUserController } = require("../controllers/userController")
userRouter.post("/", createUserController);
module.exports = userRouter;
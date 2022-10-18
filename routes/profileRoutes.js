const express = require('express');
const profileRouter = express.Router();
const {getProfileByUserName} =require("../controllers/profileController");
profileRouter.get("/:username",getProfileByUserName);
module.exports = profileRouter;


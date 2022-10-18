const express = require('express');
const profileRouter = express.Router();
const {getProfileByUserName,getAllProfilesController} =require("../controllers/profileController");
profileRouter.get("/:username",getProfileByUserName);
profileRouter.get("/", getAllProfilesController);
module.exports = profileRouter;


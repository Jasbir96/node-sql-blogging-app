const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUserController = async function (req, res) {
    try {
        let userObj = req.body;
        if(userObj.username==undefined||
            userObj.email==undefined||
            userObj.confirmPassword==undefined||
            userObj.bio==undefined){

    res.status(400).json({
            status: "failure",
            message:"some required fields are missing"})   
            return;
        }
    await userModel.create(userObj);
    res.status(201).json({
            status: "success",
            message: "user created"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status:"failure"
        })
    }
}

const loginUserController = async function (req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({
            status: "failure",
            message:"email or password is missing"})   
            return;            
        }
        const user = await userModel.getByEntity({ email });
        if (!user) {
            res.status(404).json({
            status: "failure",
            message:"user does not exist kindly signup"})
            return;            
        }
        let result = await bcrypt.compare(password,user["password_hash"]);
        if (!result) {
            res.status(401).json({
            status: "failure",
            message:"email or password is incorrect"}) 
            return;                        
        }
        // creating and sending jwt 
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.cookie("jwt", token, {
            httpOnly: true,
        })

        res.status(200).json({
            status: "success",
            message:user
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status:"failure"
        })
    }
}

const followUserController = async function (req, res) {
    try {
        if(req.body.following_id==undefined){
            res.status(400)
            .json({
                    status:"failure",
                    message:"missing required parameters"
            })}
        let userId = req.userId;
        // the user i want to follow;
        let followingId = req.body.following_id
        await userModel.follow(userId, followingId);
        res.status(200).json({
            status: "success",
            result: "you are now a follower"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
const unFollowUserController = async function (req, res) {
    try {
        if (req.body.following_id == undefined) {
            res.status(400)
                .json({
                    status: "failure",
                    message: "missing required parameters"
                })
        }
        let userId = req.userId;
        let followingId = req.body.following_id
;
        await userModel.unfollow(userId, followingId);
        res.status(200).json({
            status: "success",
            result: "you are not a follower anymore"
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}
module.exports={
    createUserController,
    loginUserController,
    followUserController,
    unFollowUserController
}
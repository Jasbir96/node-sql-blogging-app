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
        const newUser = await userModel.create(userObj);
        newUser.password = undefined;
        res.status(201).json({
            status: "success",
            message: userObj
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
        let res = await bcrypt.compare(user.password, password);
        if (!res) {
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
        user.password = undefined;
        res.status(200).json({
            status: "success",
            message:user
        })
    } catch (err) {
        res.status(500).json({
            err: err.message
        })
    }
}
module.exports={
    createUserController,
    loginUserController
}
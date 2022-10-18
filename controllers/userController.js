const userModel = require("../models/userModel");

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
module.exports={
    createUserController
}
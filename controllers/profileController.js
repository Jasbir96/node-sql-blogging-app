const userModel = require("../models/userModel");
const getProfileByUserName = async function (req, res) {
    try {
        const username = req.params.username;
        const user = await userModel.getByEntity({ username });
        if (!user) {
            res.status(404).json({
                status:"failure",
                message:"User not found"
             });
        }
        res.status(200).json({
            status:"success",
            message:user
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message:err.message
        })
    }
}
const getAllProfilesController = async function (req, res) {
    try {
        const page=req.query.page||1;
        const size=req.query.size||10;
        const users = await userModel.getAll(page,size);
        if(users.length==0){
        res.status(404).json({
            status: "failure",
            message:"no user found"
        })
            return;     
        }
        res.status(200).json({
            status: "success",
            message:users
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            err:err.message
        })
    }
}
module.exports ={
    getProfileByUserName,
    getAllProfilesController
}
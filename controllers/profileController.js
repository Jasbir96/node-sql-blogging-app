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
    } catch (err) {
        res.status(500).json({
            status: "failure"
        })
    }
}
module.exports ={
    getProfileByUserName
}
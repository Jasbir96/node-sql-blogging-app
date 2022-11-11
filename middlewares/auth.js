const jwt = require("jsonwebtoken");

const protectRouteMiddleWare = async (req, res, next) => {
    try {
        // you are bringing the token to get your response
        let decryptedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        if (decryptedToken) {
            let userId = decryptedToken.id;
            //setting userId for other controller function so they can identify user also 
            req.userId = userId
            next();
        } else {
            res.status(401).json({
                status: "failure",
                message: "kindly login to access"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status:"failure"

        })
    }
}
const identifyIsSameUserMiddleware = (req, res, next) => {
    try {
        let loggedinUser = req.userId;
        let assetOwner = req.body.auid;

        if(assetOwner==undefined){
        res.status(400).json({
            status: "failure",
            message:"you are not the owner of this asset"})   
            return;
        }
        if (loggedinUser == assetOwner) {
            delete req.body.auid;
            next()
        } else {
            res.status(401).json({
            status: "failure",
            message:"unauthorized access"
        })   
            return;
        }
    } catch (err) {
        return res.status(500).json({
            status: "failure",
            err: err.message
        })
    }
}

module.exports={
    protectRouteMiddleWare,
    identifyIsSameUserMiddleware
}
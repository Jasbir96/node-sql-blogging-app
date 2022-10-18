const express = require("express");

const app = express();
require("dotenv").config();
// added to accpet json data of body
app.use(express.json());

// added 404 page not found route
app.use(function (req, res) {
    res.status(404).json({
        status: "failure",
        message: "given route does not exist"
    })
})

app.listen(3000,()=>{
    console.log("listening on port 3000");
})

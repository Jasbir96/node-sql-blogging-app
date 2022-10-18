const express = require("express");
const userRouter = require("./routes/userRoutes");
const profileRouter = require("./routes/profileRoutes");

const app = express();
require("dotenv").config();
// added to accept json data of body
app.use(express.json());

app.use("/users",userRouter);
app.use("/profiles",profileRouter);



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

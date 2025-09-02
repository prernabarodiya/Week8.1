const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", function(req, res){
    res.json({
        message: "Signup Endpoint"
    })
})

adminRouter.post("/signin", function(req, res){
    res.json({
        message: "Signin Endpoint"
    })
})

adminRouter.post("/course", function(req, res){
    res.json({
        message: "Signin Endpoint"
    })
})

adminRouter.get("/course", function(req, res){
    res.json({
        message: "Signin Endpoint"
    })
})

adminRouter.get("/course/bulk", function(req, res){
    res.json({
        message: "Signin Endpoint"
    })
})


module.exports = {
    adminRouter: adminRouter
}
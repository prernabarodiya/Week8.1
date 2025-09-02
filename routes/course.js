const { Router } = require("express");
const courseRouter = Router();

courseRouter.post("/purchase", function(req, res){
    res.json({
        message: "the course you purchased"
    })
})

courseRouter.get("/preview", function(res, res){
    message: "All courses are"
})

module.exports = {
    courseRouter: courseRouter
}
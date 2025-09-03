const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully purchased the course"
    })
})

courseRouter.get("/preview", async function(res, res){
    const courses = await courseModel.find({});

    res.json({
        message: "All courses are",
        courses
    })

})

module.exports = {
    courseRouter: courseRouter
}
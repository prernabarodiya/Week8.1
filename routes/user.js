const { Router } = require("express");
const userRouter = Router();
const { userModel, adminModel, courseModel, purchaseModel } = require("../db");
const { JWT_USER_PASSWORD } = require("../config");
const { adminMiddleware, userMiddleware } = require("../middleware/user")

const { z, boolean } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const e = require("express");


userRouter.post("/signup", async function(req, res){

    const { email, password, firstName, lastName} = req.body;

    //input secure
    const requiredBody = z.object({
        email: z.email().min(5).max(100),
        firstName: z.string().min(2).max(100),
        lastName: z.string().min(2).max(100),
        password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must not exceed 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess){
        res.json({
            message: "incorrect Format"
        })
        return;
    }

    // TODO: hash the password so plaintext pw is not stored in the DB
    let errorThrown = false;

    try{
        const hashPassword = await bcrypt.hash(password, 5);
        await userModel.create({
            email: email, 
            password: hashPassword, 
            firstName: firstName,
            lastName: lastName
        })
    }catch(e){
        message: "User already exists",
        errorThrown = true;

    }

    if(!errorThrown){
        res.json({
            message: "Signup Endpoint"
        })
    }

})

userRouter.post("/signin", async function(req, res){

    const { email, password} = req.body;

    const user = await userModel.findOne({
        email: email        
    })

    if(!user){
        res.json({
            message: "User does not exists"
        })
        return;
    }else{
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            res.json({
                message: "Incorrect credential"
            })

            return;
        }else{
            const token = jwt.sign({
                id: user._id
            }, JWT_USER_PASSWORD);

            res.json({
                token: token
            })
            return;
        }
    }

    
})

userRouter.get("/purchases", userMiddleware, async function(req, res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId
    })

    const courseData = await courseModel.find({
        _id: { $in: purchases.map(x => x.courseId)}
    })

    res.json({
        message: "Purchased Courses by user are : ",
        purchases,
        courseData
    })
})


module.exports = {
    userRouter: userRouter
}


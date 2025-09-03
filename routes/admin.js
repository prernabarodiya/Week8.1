const { Router } = require("express");
const adminRouter = Router();
const { z, boolean } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin")


const { userModel, adminModel, courseModel, purchaseModel } = require("../db");
const { JWT_ADMIN_PASSWORD } = require("../config");


adminRouter.post("/signup", async function(req, res){
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
        await adminModel.create({
            email: email, 
            password: hashPassword, 
            firstName: firstName,
            lastName: lastName
        })
    }catch(e){
        message: "Admin already exists",
        errorThrown = true;

    }

    if(!errorThrown){
        res.json({
            message: "Signup Endpoint"
        })
    }
})

adminRouter.post("/signin", async function(req, res){
    const { email, password} = req.body;
    
    const admin = await adminModel.findOne({
        email: email        
    })

    if(!admin){
        res.json({
            message: "Admin does not exists"
        })
        return
    }else{
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if(!passwordMatch){
            res.json({
                message: "Incorrect credential"
            })

            return;
        }else{
            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            res.json({
                token:token
            })
            return;
        }
    }
})

adminRouter.post("/course", adminMiddleware,async function(req, res){
    const adminId = req.userId;

    const { title, desc, price, imageUrl, creatorId } = req.body;

    const course = await courseModel.create({
        title: title,
        desc: desc, 
        price: price, 
        imageUrl: imageUrl, 
        creatorId: adminId
    })
    
    res.json({
        message: "Course Created",
        courseId: course._id
    })
})

adminRouter.put("/course",adminMiddleware, async function(req, res){
    try {
        const adminId = req.userId;
        const { title, desc, price, imageUrl, courseId } = req.body;

        // find and update only if course belongs to this admin
        const updatedCourse = await courseModel.findOneAndUpdate(
            { _id: courseId, creatorId: adminId },
            { title, desc, price, imageUrl },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(403).json({
                message: "You are not allowed to update this course or course not found"
            });
        }

        res.json({
            message: "Course Updated",
            courseId: updatedCourse._id,
            course: updatedCourse
        });
    } catch (err) {
        res.status(500).json({ 
            error: err.message 
        });
    }
})


adminRouter.get("/course/bulk",adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const courses = await courseModel.find({        
        creatorId: adminId
    });


    
    res.json({
        message: "Admin Courses are",
        courses
    })
    
})


module.exports = {
    adminRouter: adminRouter
}
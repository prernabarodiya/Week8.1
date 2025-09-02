const { Schema, default: mongoose, model } = require("mongoose");
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    email: String,
    firstName: String,
    password: String,
    lastName: String
})

const courseSchema = new Schema({
    title: String,
    desc: String, 
    price: Number, 
    imgUrl: String,
    creatorId: ObjectId
})

const adminSchema = new Schema({
    email: String,
    firstName: String,
    password: String,
    lastName: String
})

const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId
})

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("user", adminSchema);
const courseModel = mongoose.model("user", courseSchema);
const purchaseModel = mongoose.model("user", purchaseSchema);

module.exports = {
    userModel,
    courseModel,
    adminModel,
    purchaseModel
}


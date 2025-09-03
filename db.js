const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    email: {type: String, unique: true},
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
    email: {type: String, unique: true},
    firstName: String,
    password: String,
    lastName: String
})

const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId
})

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}


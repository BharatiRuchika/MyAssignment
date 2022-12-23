const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [30, "your name cannot exceed 30 characters"]
    },
    username: {
        type: String,
        required: [true, "please enter your username"]
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email address"]
    },
    website: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userId:{
        type: Number,
        required: true
    },
    avatar: {
        type:String,
        default:"https://bootdey.com/img/Content/avatar/avatar1.png"
    },
    userList:[
        {
            name:{
                type:String,
                required:true
            },
            username:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:String,
                required:true
            },
            website:{
                type:String,
                required:true
            },
            userId:{
                type:Number,
                required:true
            },
            status:{
                type:String,
                required:true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
})
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
})

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     this.password = await bcrypt.hashSync(this.password, 10);
// })
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     console.log(this.password);
//     console.log(enteredPassword);
//     return await bcrypt.compareSync(enteredPassword, this.password);
// }
userSchema.methods.comparePassword = function(enteredPassword) {
    console.log("this",this);
    return bcrypt.compareSync(enteredPassword,this.password)
}
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, "GUvi!jdks", {
        expiresIn: "7d"
    });
}

module.exports = mongoose.model("users", userSchema)
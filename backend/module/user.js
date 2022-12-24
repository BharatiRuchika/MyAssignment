const User = require("../models/user");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../utils/catchAsyncErrors");
exports.register = async (req, res, next) => {
   console.log("im in register");
   try {
      console.log("body", req.body);
      let { name, username, email, password, status, website, phone, userId } = req.body;
      var oldUser = await User.find({ email });
      console.log("user", oldUser);
      console.log("length", oldUser.length);
      // var oldUser = User.find({email}).select('+password');
      // console.log("oldUser",oldUser.length);
      if (oldUser.length != 0) {
         throw new ErrorHandler('You already registered..Please log in..', 400);
      }
      var count = await User.countDocuments()
      userId = count + 1 + 10;
      var user = await User.create({
         name,
         username,
         email,
         password,
         status,
         website,
         phone,
         userId
      })
      const token = user.getJwtToken();
      const options = {
         expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
         ),
         httpOnly: true,
         secure: false
      }
      res.cookie("token", token, options).json({
         success: true,
         token,
         user
      })

   } catch (error) {
      console.log("errror", error);
      res.status(400).send({
         success: false,
         error,
         errMessage: error.message,
         stack: error.stack
      });
   }
}

exports.validateUser = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      console.log("body", req.body);
      var user = await User.findOne({ email }).select("+password");
      console.log("user", user);
      if (user == null) {
         throw new ErrorHandler('Invalid Email or Password', 400);
         // return res.send({errMessage:"Invalid Email or Password"})
      }
      const isPasswordMatch = await user.comparePassword(password);
      console.log("isPasswordMatch", isPasswordMatch)
      if (!isPasswordMatch) {
         console.log("im here");
         console.log(isPasswordMatch)
         throw new ErrorHandler('Invalid Email or Password', 400);
      }
      const token = user.getJwtToken();
      console.log("token",token);
      const options = {
         expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
         ),
         httpOnly: true,
         secure: false
      }
      res.cookie("token", token, options).json({
         success: true,
         token,
         user
      })
   } catch (error) {
      res.status(400).send({
         success: false,
         error,
         errMessage: error.message,
         stack: error.stack
      });
   }
}

exports.getUsers = async (req, res, next) => {
   try {
      console.log("im in get users");
      const user = await User.findById(req.user.id);
      console.log("user",user.userList);

      res.status(200).json({
         success: true,
         users:user.userList
      })
   } catch (error) {
      res.send({
         success: false,
         error,
         errMessage: error.message,
         stack: error.stack
      });
   }
}

exports.Logout = async (req, res, next) => {
   console.log("im in logout");
   try {
      res.cookie('token', null, {
         expires: new Date(Date.now()),
         httpOnly: true
      });
      res.send({
         success: true,
         msg: "logged out"
      })
   } catch (err) {
      console.log("error",err);
      res.send({ error: err })
   }
}

exports.addUser = async(req,res,next)=>{
   console.log("im in add user");
   console.log("body",req.body);
   console.log("id",req.user.id)
   try{
      let { name, username, email, status, website, phone,userId } = req.body;
      console.log("email",email);
      console.log("status",status);
      // var count = await User.userList.length();
      // console.log("newUserData",newUserData)
      var myUser = await User.findOne({_id:req.user.id})
      console.log("myuser",myUser);
      let userList = myUser.userList;
      userId = userList.length+1;
      console.log("userlist length",userList.length);
      const newUserData = {
         name,
         username,
         email,
         phone,
         status,
         website,
         userId
      }
      userList.push(newUserData);
      console.log("userList",userList);
      const updatedUser = await User.findByIdAndUpdate(req.user.id,{ userList : userList},{returnOriginal: false})
      console.log("updatedUser",updatedUser);
      res.send({
         success: true,
         users: updatedUser.userList
      })
      
   }catch(error){
      res.send({
         success: false,
         error,
         errMessage: error.message,
         stack: error.stack
      });
   }
}
exports.editUser = async (req, res, next) => {
   try {
      console.log("im in edit");
      console.log("body",req.body);
      let { name, username, phone, status, website } = req.body;
      const newUserData = {
         name,
         username,
         phone,
         status,
         website
      }
      console.log("id",req.user.id);
      const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
         new: true,
         runValidators: true,
         useFindAndModify: false
      })
      res.status(200).json({
         success: true, user
      })
   } catch (err) {
      console.log("error",err);
      res.send({ error: err })
   }
}
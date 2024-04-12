import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.post("/register" , async (req, res)=>{
      const {username , password} = req.body;
      const user = await UserModel.findOne({username});
      if(user){
            return res.json({message:"user already exist"});
      }
      const hashedPassword = await bcrypt.hash(password , 10)
      const newUser = new UserModel({username , password:hashedPassword});
      await newUser.save();
      res.json({message:"user registered"});
} );

router.post("/login" , async (req,res)=>{
      const {username , password} = req.body;
      const user = await UserModel.findOne({username});
      if(!user){
            return res.json({message:"user doeans't exist"});
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if(!validPassword){
            return res.json({message:"Invalid register"});
      }
      const token = jwt.sign({id:user._id},"secret");
      res.json({token , userID:user._id});
} );
export {router as userRouter}; 
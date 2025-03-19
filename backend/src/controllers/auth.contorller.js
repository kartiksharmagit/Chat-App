import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) =>{
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password){
            return res.status(400).json({message : "All Fields are Required"});
        }
        if(password.length<8){
            return res.status(400).json({message : "Password must have at least 8 characters"});
        }
        const user = await User.findOne({email});
        if (user){
            return res.status(400).json({message : "Email already exists"});
        }

        //for bcryption or hashing of data
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new User
        const newUser = new User({
            fullName,
            email,
            password : hashedPassword,
        })
        if (newUser){
            //Generate JWT Token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message : "Invalid User Data"});
        }
    } catch (error) {
            console.log("Error in signUp controller" + error);
            res.status(500).json({message : "Internal Server Error"});
    }
};

export const login = async (req,res) =>{
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({message : "All Fields are Required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        generateToken(user._id, res);

        res.status(201).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller" + error);
        res.status(500).json({message : "Internal Server Error"});
    }
};

export const logout = (req,res) =>{
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message : "Logged Out Successfully"});
    } catch (error) {
        console.log("Error in logout controller" + error);
        res.status(500).json({message : "Internal Server Error"});
    }
};

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message : "Profile Pic Required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new : true}
        );

        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error in updateProfile", error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller" + error);
        res.status(500).json({message : "Internal Server Error"});
    }
};
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const OTP_STORE = {};

export const signup = async (req,res) =>{
    try {
        const { fullName, email, username, password } = req.body;
        if (!fullName || !email || !password || !username){
            return res.status(400).json({message : "All Fields are Required"});
        }
        if(password.length<8){
            return res.status(400).json({message : "Password must have at least 8 characters"});
        }
        const existinguser = await User.findOne({email});
        if (existinguser){
            return res.status(400).json({message : "Email already exists"});
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is taken, choose another" });
        }

        //for bcryption or hashing of data
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new User
        const newUser = new User({
            fullName,
            email,
            username,
            password : hashedPassword,
        })
        if (newUser){
            //Generate JWT Token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                username : newUser.username,
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

// 📌 Send OTP to user's email
export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists. Please log in instead." });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    OTP_STORE[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    // Send OTP via email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            replyTo: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `-${otp} is Your OTP Code. It will expire in 5 minutes.`,
            html: `<p>Your OTP code is ${otp}. It will expire in 5 minutes.</p>`,
        });

        res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
        console.log(error);
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const storedOTP = OTP_STORE[email];

    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    delete OTP_STORE[email]; // Remove OTP after successful verification
    res.status(200).json({ message: "OTP verified! Proceed to complete signup", email });
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
};

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller" + error);
        res.status(500).json({message : "Internal Server Error"});
    }
};


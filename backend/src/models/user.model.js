import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true, // Ensure usernames are unique
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePic: {
            type: String,
            default: "",
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // References the User model
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // References the User model
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

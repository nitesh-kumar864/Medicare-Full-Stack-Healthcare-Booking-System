import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: {
        type: String, unique: true, required: true, lowercase: true, trim: true
    },
    password: { type: String, required: false },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    lastPasswordResetRequest: {
        type: Date,
    },
    image: {
        type: String,

        default: 'https://res.cloudinary.com/drmmyzu5j/image/upload/v1765535691/user_3177440_gjq9bi.png'
    },
    address: { type: Object, default: { line1: '', line2: '' } },
    gender: { type: String, default: "Not selected" },
    dob: { type: String, default: "Not selected" },
    phone: { type: String, default: "0000000000" },


});


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;

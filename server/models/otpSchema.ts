import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    user: {
        type: String,
        ref: 'User'
    },
    otpToken: {
        type: String,
        unique: true
    },
}, {
    timestamps: true
});

export const OTPModel = mongoose.model('OTPModel', otpSchema);
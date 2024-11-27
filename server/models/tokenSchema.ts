import mongoose, { Schema } from "mongoose";
import { tokenTypes } from "../config/tokens";

const tokenSchema = new Schema({
    token: {
        type: String
    },
    user: {
        type: String,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [tokenTypes.ACCESS, tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]
    },
    expires: {
        type: Date
    },
    blackListed: {
        type: Boolean
    }
});

export const Token = mongoose.model('Token', tokenSchema);
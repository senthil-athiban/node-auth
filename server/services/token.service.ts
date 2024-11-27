import jwt from "jsonwebtoken";
import moment from "moment";
import { tokenTypes } from "../config/tokens";
import { Token } from "../models/tokenSchema";

const generateToken = (userId: string, expires: any, type: string, secret = process.env.JWT_SECRET_KEY!) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    }
    return jwt.sign(payload, secret);
};

const saveToken = async (token: string, user: string, expires: any, type: string) => {
    const newToken = new Token({user, token, expires, type});
    return await newToken.save();
}
const generateVerifyEmailToken = async (userId:any) => {
    const expires = moment().add('10', 'minutes');
    const verifyEmailToken = generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
}

const verifyToken = async (token: string, type: string) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const tokenDoc = await Token.findOne({token, user: payload.sub, type});
    if(!tokenDoc) {
        throw new Error('no token found');
    }
    return tokenDoc;
}

export { generateToken, generateVerifyEmailToken, verifyToken };
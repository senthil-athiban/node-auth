import jwt from "jsonwebtoken";
import { Token } from "../models/tokenSchema";
import User from "../models/userSchema";
import { tokenTypes } from "../config/tokens";
import { tokenService, userService } from ".";
import ApiError from "../utils/apiError";

const verifyEmail = async (token: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(token, tokenTypes.VERIFY_EMAIL);
    //@ts-ignore
    const user = await User.findOne({ username: verifyEmailTokenDoc.user });
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({
      user: user.username,
      type: tokenTypes.VERIFY_EMAIL,
    });
    await userService.updateUserById(user.username, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(400, "Email verification failed");
  }
};

const verifyOTP = async (token: string) => {
    try {
      const verifiedTokenDoc = jwt.verify(token, process.env.OTP_SECRET_KEY!)
      const user = await User.findOne({username: verifiedTokenDoc.sub, otpCode: token});
      if(!user) {
        throw new ApiError(404, 'User not found')
      }
      await User.findOneAndUpdate({username: user.username}, { $unset: { otpCode: "" } }, {new: true});
      return user;
    } catch (error) {
      throw new ApiError(400, "Two factor auth verification failed");
    }
}
export { verifyEmail, verifyOTP };
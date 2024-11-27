import jwt from "jsonwebtoken";
import { Token } from "../models/tokenSchema";
import UserModel from "../models/userSchema";
import { tokenTypes } from "../config/tokens";
import { tokenService, userService } from ".";
import ApiError from "../utils/apiError";

const verifyEmail = async (token: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(token, tokenTypes.VERIFY_EMAIL);
    console.log("[verifiedToken]", verifyEmailTokenDoc);
    //@ts-ignore
    const user = await UserModel.findOne({ username: verifyEmailTokenDoc.user });
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({
      user: user.username,
      type: tokenTypes.VERIFY_EMAIL,
    });
    await userService.updateUserById(user.username, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(404, "Email verification failed");
  }
};

export { verifyEmail };
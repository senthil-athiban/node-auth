import jwt from "jsonwebtoken";
import moment from "moment";
import { tokenTypes } from "../config/tokens";
import { Token } from "../models/tokenSchema";
import { OTPModel } from "../models/otpSchema";
import User from "../models/userSchema";
import { userService } from ".";

const generateToken = (
  userId: string,
  expires: any,
  type: string,
  secret = process.env.JWT_SECRET_KEY!
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  user: string,
  expires: any,
  type: string
) => {
  const newToken = new Token({ user, token, expires, type });
  return await newToken.save();
};

const generateResetPasswordToken = async (username: string) => {
  const expires = moment().add(10, "minutes");
  const resetPasswordToken = generateToken(
    username,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await Token.create({
    token: resetPasswordToken,
    user: username,
    type: tokenTypes.RESET_PASSWORD,
    blackListed: true,
  });
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (userId: string) => {
  const expires = moment().add("10", "minutes");
  const verifyEmailToken = generateToken(
    userId,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

const generateOTPToken = async (userId: string) => {
  const expires = moment().add(10, "minutes");
  const mfaToken = generateToken(userId, expires, tokenTypes.OTP, process.env.OTP_SECRET_KEY!);
  await OTPModel.create({ otpToken: mfaToken, user: userId });
  await userService.updateUserById(userId, { otpCode: mfaToken });
  return mfaToken;
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  const tokenDoc = await Token.findOne({ token, user: payload.sub, type });
  if (!tokenDoc) {
    throw new Error("no token found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (userId: any) => {
  const accessTokenExpires = moment().add(15, "minutes");
  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    tokenTypes.REFRESH,
    process.env.REFRESH_SECRET_KEY
  );

  const refreshTokenExpires = moment().add(1, "hours");
  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    process.env.REFRESH_SECRET_KEY
  );

  await saveToken(
    refreshToken,
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  return { accessToken, refreshToken };
};

export {
  generateToken,
  generateVerifyEmailToken,
  verifyToken,
  generateResetPasswordToken,
  generateAuthTokens,
  generateOTPToken
};

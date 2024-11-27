import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  refreshtoken: String,
  isEmailVerified: {
    type: Boolean,
  },
  isMFAEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  otpCode: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("user", userSchema);

export default User;

import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  refreshtoken: String,
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;

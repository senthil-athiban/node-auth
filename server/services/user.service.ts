import UserModel from "../models/userSchema";
import ApiError from "../utils/apiError";

const updateUserById = async (id: string, contentToUpdate: any) => {
  const user = await UserModel.findOne({ username: id });
  console.log("user: ", user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log("content to update: ", contentToUpdate);
  const res = await UserModel.findOneAndUpdate(
    { username: user.username },
    contentToUpdate,
    { new: true }
  );
  console.log("[RES]:", res);
  return user;
};


export { updateUserById };

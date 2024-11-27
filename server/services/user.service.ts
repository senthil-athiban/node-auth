import UserModel from "../models/userSchema";
import ApiError from "../utils/apiError";

const updateUserById = async (id: string, contentToUpdate: any) => {
  const user = await UserModel.findOne({ username: id });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const res = await UserModel.findOneAndUpdate(
    { username: user.username },
    contentToUpdate,
    { new: true }
  );
  return user;
};

const getUserById = async (id: string) => {
  const user = await UserModel.findOne({username: id});
  if(!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

export { updateUserById, getUserById };

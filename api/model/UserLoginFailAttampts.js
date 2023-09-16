import mongoose from "mongoose";
const UserLoginFailAttampts = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    login_fail_timestamp: {
      type: String,
      required: true,
    },
    login_fail_count:{
      type: Number,
      required: true,
    },
  },
);

export default mongoose.model("UserLoginFailAttampts", UserLoginFailAttampts);
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_locked: {
      type: Boolean,
      required: true,
      default: false
    },

  },
);

export default mongoose.model("User", UserSchema);
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { timestamps: true }
);
// mongoose.models = {};
// export default mongoose.model("User", UserSchema);
export default mongoose.models.User || mongoose.model("User", UserSchema);

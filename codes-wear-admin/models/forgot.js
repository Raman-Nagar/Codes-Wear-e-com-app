import mongoose from "mongoose";

const ForgotSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);
mongoose.models = {};
export default mongoose.model("Forgot", ForgotSchema);
// export default mongoose.models.User || mongoose.model("Forgot", ForgotSchema);
    // userid: { type: String, required: true },

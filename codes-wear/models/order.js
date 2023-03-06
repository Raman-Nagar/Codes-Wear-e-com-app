import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: "" },
    products:{ type: Object, required: true},
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionid: { type: String, default: "Payment Fail..!", required: true },
    status: { type: String, default: "Initiated", required: true },
    deliverystatus: { type: String, default: "unshipped", required: true },
  },
  { timestamps: true }
);
mongoose.models = {};
export default mongoose.model("Order", OrderSchema);

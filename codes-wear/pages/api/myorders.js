import Order from "@/models/order";
import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";

async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.body.token;
    // console.log("token = ", token)
    const data = jsonwebtoken.verify(token, process.env.SECRET_JWTKEY);
    let orders = await Order.find({ email: data.email, status:"Paid" });

    res.status(200).json({ orders });
  } else {
    res.status(400).json({ err: "bad req" });
  }
}
export default connectDb(handler);

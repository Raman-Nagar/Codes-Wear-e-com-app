import Product from "@/models/product";
import connectDb from "@/middleware/mongoose";

async function handler(req, res) {
  let products = await Product.find({});
  
  res.status(200).json({ products });
}

export default connectDb(handler);
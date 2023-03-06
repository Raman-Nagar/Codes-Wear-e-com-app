import Product from "@/models/product";
import connectDb from "@/middleware/mongoose";

async function handler(req, res) {
  if (req.method == "PUT") {
    for (let i = 0; i < req.body.length; i++) {
      let p = await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
    }
    res.status(200).json({ sucess: "update sucess" });
  } else {
    res.status(400).json({ error: "bad req" });
  }
}

export default connectDb(handler);

import Product from "../../models/product";
import connectDb from "../../middleware/mongoose";
import NextCors from 'nextjs-cors';

async function handler(req, res) {

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method == "PUT") {
    console.log(req.body)
    for (let i = 0; i < req.body.length; i++) {
      let r = await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
      console.log(r)
    }
    res.status(200).json({ success:true, message: "update sucess" });
  } else {
    res.status(400).json({success:false, error: "bad req" });
  }
}

export default connectDb(handler);

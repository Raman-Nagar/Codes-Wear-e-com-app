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

  let products = await Product.find({});
  
  res.status(200).json({ products });
}

export default connectDb(handler);
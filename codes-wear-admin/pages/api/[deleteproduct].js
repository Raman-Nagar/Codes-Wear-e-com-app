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

    if (req.method == 'DELETE') {
        let product = await Product.deleteOne({ _id: req.query.deleteproduct })
        if(product.deletedCount){
            res.status(200).json({ sucess:true , product })
        }else{
            res.status(404).json({ sucess:false , product })
        }
    } else {
        res.status(400).json({ sucess:false , err: "this is error" })
    }
}

export default connectDb(handler)

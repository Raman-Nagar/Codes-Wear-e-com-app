import User from "../../models/user";
import connectDb from "../../middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import NextCors from 'nextjs-cors';

async function handler(req, res) {

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method == "POST") {
    const token = req.body.token;
    const user = jsonwebtoken.verify(token, process.env.SECRET_JWTKEY);
    await User.findOneAndUpdate({ email: user.email }, {name:req.body.name, address:req.body.address, pincode:req.body.pincode, phone:req.body.phone});

    res.status(200).json({success:true});
  } else {
    res.status(400).json({ error: "bad req" });
  }
}

export default connectDb(handler);

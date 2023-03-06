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
    let dbuser = await User.findOne({ email: user.email });
    const {name, email, password, address, pincode, phone} = dbuser
    res.status(200).json({name, email, password, address, pincode, phone});
  } else {
    res.status(400).json({ error: "bad req" });
  }
}

export default connectDb(handler);

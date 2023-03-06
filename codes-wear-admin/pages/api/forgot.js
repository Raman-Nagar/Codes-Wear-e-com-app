import User from "../../models/user";
import connectDb from "../../middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
var CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
import NextCors from 'nextjs-cors';

async function handler(req, res) {

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {
        const data = jsonwebtoken.verify(req.body.token, process.env.SECRET_JWTAUTHKEY);
        console.log(data)
        let user =  await User.findOneAndUpdate(
          { email:data.email },
          {
            password: CryptoJS.AES.encrypt(
              req.body.cpassword,
              process.env.SECRET_KEY
            ).toString(),
          }
        );
        res.status(200).json({ success: true });
    }
  else {
    res.status(400).json({ success: false, error: "bad req" });
  }
}

export default connectDb(handler);
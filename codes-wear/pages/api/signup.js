import User from "@/models/user";
import connectDb from "@/middleware/mongoose";
var CryptoJS = require("crypto-js");

async function handler(req, res) {
  if (req.method == "POST") {
    const {name, email, password} = req.body;
      let u = new User({name, email, password:CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString()});
      await u.save();
    
    res.status(200).json({ success:"success" });
  } else {
    res.status(400).json({ error: "bad req" });
  }
}

export default connectDb(handler);
import User from "@/models/user";
import connectDb from "@/middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

async function handler(req, res) {
  if (req.method == "POST") {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const decryptPass = bytes.toString(CryptoJS.enc.Utf8);
      if (email === user.email && password === decryptPass) {
        let token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.SECRET_JWTKEY, { expiresIn: '2d' }
        );
        res.status(200).json({ success: true, token, email:user.email });
      } else {
        res.status(400).json({ success: false, error: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ success: false, error: "no user found" });
    }
  } else {
    res.status(404).json({ success: false, error: "bad request" });
  }
}

export default connectDb(handler);

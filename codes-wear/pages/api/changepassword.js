import User from "@/models/user";
import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
var CryptoJS = require("crypto-js");

async function handler(req, res) {
  if (req.method == "POST") {
    const { token, password, npassword, cpassword } = req.body;
    const data = jsonwebtoken.verify(token, process.env.SECRET_JWTKEY);

    let user = await User.findOne({ email: data.email });
    if (user) {
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const decryptPass = bytes.toString(CryptoJS.enc.Utf8);
      if (password === decryptPass && npassword === cpassword  ) {
        await User.findOneAndUpdate(
          { email: user.email },
          {
            password: CryptoJS.AES.encrypt(
              cpassword,
              process.env.SECRET_KEY
            ).toString(),
          }
        );
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "invalide cridentials" });
      }
    } else {
      res.status(400).json({ success: false, error: "user not found" });
    }
  } else {
    res.status(400).json({ success: false, error: "bad req" });
  }
}

export default connectDb(handler);

import connectDb from "../../middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import Forgot from "../../models/forgot";
var CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
import NextCors from "nextjs-cors";

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {
    try {
      let token = jsonwebtoken.sign(
        { email: req.body.email },
        process.env.SECRET_JWTAUTHKEY,
        { expiresIn: "2m" }
      );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ramannagar08082000@gmail.com", // generated ethereal user
          pass: process.env.SECRET_PASS,
        },
      });
      const mailOptions = {
        from: "ramannagar08082000@gmail.com",
        to: "ramannagar08082000@gmail.com",
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 2 MINUTES http://localhost:3000/forgot?token=${token}`,
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log("error = > ", error);
          res
            .status(401)
            .json({ status: 401, success: false, error: "email not send" });
        } else {
          let forgot = new Forgot({
            email: req.body.email,
            token,
          });
          let result = await forgot.save();
          res
            .status(201)
            .json({
              status: 200,
              success: true,
              message: "Email sent Succsfully",
            });
        }
      });
    } catch (error) {
      console.log(error)
      res.status(404).json({ success: false, error:"network failed!" });
    }
  } else {
    res.status(400).json({ success: false, error: "bad req" });
  }
}

export default connectDb(handler);

//   html: `We have sent you this email in response to your request to reset your password on Codes wear.com.

//   To reset your password please follow the link below:

//   <a href="http://localhost:3000/forgot?token=${token}">Click hare to reset password</a>

//   <br/><br/>

//   We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by going to your Codes wear.com My Account Page and Change your Password.

//   <br/><br/>`,

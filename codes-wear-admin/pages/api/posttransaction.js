const crypto = require("crypto");
import Order from "../../models/order";
import connectDb from "../../middleware/mongoose";
import Product from "../../models/product";
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
      //validate razorPay checksum
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_SKEY)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        //Update status into Orders table after checking the transaction status

        let order = await Order.findOneAndUpdate(
          { orderId: req.body.razorpay_order_id },
          {
            status: "Paid",
            paymentInfo: JSON.stringify(req.body),
            transactionid: razorpay_payment_id,
          }
        );
        let products = order.products;
        for (let slug in products) {
          let product = await Product.findOneAndUpdate(
            { slug: slug },
            { $inc: { availableQty: -products[slug].qty } }
          );
        }

        //Initiate shipping

        //Redirect User to the confermation page
        res.redirect(
          `http://localhost:3000/order?id=${order._id}&clearcart=${1}`,
          200
        );
      } else {
        res.status(401).json({
          success: false,
          error: "Some Error Occurred",
        });
      }
    } catch (error) {
      console.log(error)
      res.status(404).json({ success: false, error:"network failed!" });

    }
  } else {
    res.status(400).json({
      success: false,
      error: "bad request",
    });
  }
}
export default connectDb(handler);

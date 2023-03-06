const Razorpay = require("razorpay");
import Order from "../../models/order";
import connectDb from "../../middleware/mongoose";
import Product from "../../models/product";
import Pincodes from "../../pincode.json";
import NextCors from "nextjs-cors";

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {
    const {
      cart,
      subTotal,
      email,
      name,
      address,
      pincode,
      phone,
      state,
      city,
    } = req.body;
    try {
      //check if the cart is tampered with
      if (!Object.keys(Pincodes).includes(pincode)) {
        res
          .status(301)
          .json({
            success: false,
            cartClear: false,
            error: "The pincode you have entered is not serviceable !",
          });
        return;
      }

      //check if the cart is tampered with
      let product,
        sumTotal = 0;
      if (subTotal <= 0) {
        res
          .status(301)
          .json({
            success: false,
            cartClear: false,
            error: "Cart Empty! Please buid your cart and try again!",
          });
        return;
      }
      for (let item in cart) {
        sumTotal += cart[item].price * cart[item].qty;
        product = await Product.findOne({ slug: item });

        //check if the cart items are out of stocks
        if (product.availableQty < cart[item].qty) {
          res
            .status(301)
            .json({
              success: false,
              cartClear: true,
              error:
                "Some items in your cart went out of stock. please try again!",
            });
          return;
        }
        if (product.price !== cart[item].price) {
          res
            .status(303)
            .json({
              success: false,
              cartClear: true,
              error:
                "The price of some items in your cart have changed. please try again!",
            });
          return;
        }
      }
      if (sumTotal !== subTotal) {
        res
          .status(305)
          .json({
            success: false,
            cartClear: true,
            error:
              "The price of some items in your cart have changed. please try again!",
          });
        return;
      }

      //check if the details are invalid
      if (phone.length !== 10 || isNaN(phone)) {
        res
          .status(200)
          .json({
            success: false,
            cartClear: false,
            error: "Please Enter your 10 digit Phone Number and try again!",
          });
        return;
      }
      if (pincode.length !== 6 || isNaN(pincode)) {
        res
          .status(200)
          .json({
            success: false,
            cartClear: false,
            error: "Please Enter your 6 digit Pincode and try again!",
          });
        return;
      }

      //insert an entry the orders table with status as pandding
      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        key_secret: process.env.NEXT_PUBLIC_RAZORPAY_SKEY,
      });

      const options = {
        amount: subTotal * 100, // amount in the smallest currency unit
        currency: "INR",
      };
      const order = await instance.orders.create(options);

      //initiate an order corresponding to this order id
      let o = new Order({
        name,
        email,
        orderId: order.id,
        phone,
        address,
        pincode,
        city,
        state,
        amount: order.amount,
        products: cart,
        status: "Pending",
        // status: order.status,
      });
      await o.save();
      res.status(200).json({
        success: true,
        cartClear: false,
        order,
      });
    } catch (error) {
      console.log(error)
      res.status(404).json({ success: false, error:"network failed!" });
    }
  } else {
    res.status(404).json({ success: false, error: "bad request" });
  }
}
export default connectDb(handler);

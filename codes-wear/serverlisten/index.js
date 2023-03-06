const Express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = Express();


app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.post("/createoreder", async (req, res) => {
  const instance = new Razorpay({
    key_id: "rzp_test_zCQCZJ0tN2nCef",
    key_secret: "RnwKXiZfAHXI9TXe0bb9jBhu",
  });

  const options = {
    amount: (1001), // amount in the smallest currency unit
    currency: "INR",
  };
    const order = await instance.orders.create(options);
  console.log(req.body)
    res.status(200).json({
      success: true,
      order,
    });
  });
  
app.post("/paymentverification",async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "RnwKXiZfAHXI9TXe0bb9jBhu")
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });

    res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

  app.listen(4000)
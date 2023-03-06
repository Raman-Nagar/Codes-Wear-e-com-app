import { BsFillBagCheckFill } from "react-icons/bs";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import Head from "next/head";
import Script from "next/script";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const checkout = ({ cart, subTotal, addToCart, removeFromCart, clearCart }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("city");
  const [state, setState] = useState("state");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState("")

  const getUserData = async (token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setName(data.name);
    setPhone(data.phone);
    setAddress(data.address);
    setPincode(data.pincode);
  };
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser && myuser.token) {
      setUser({ value: myuser.token, email:myuser.email });
      setEmail(myuser.email)
      getUserData(myuser.token)
    }
  }, [])
  useEffect(() => {
    if ( name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3 ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, phone, address, pincode])
  

  const handleChange = async (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "address") {
      setAddress(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length === 6) {
        let pins = await fetch("/api/pincodes");
        let pinjson = await pins.json();
        if (Object.keys(pinjson).includes(e.target.value)) {
          setState(pinjson[e.target.value][0]);
          setCity(pinjson[e.target.value][1]);
        } else {
          setState("state");
          setCity("city");
        }
      } else {
        setState("state");
        setCity("city");
      }
    }
      
  };
  const checkoutHandler = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/pretransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        subTotal,
        email,
        name,
        address,
        pincode,
        phone,
        state,
        city,
      }),
    });
    const data = await res.json();
    if (data.success) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Nagar Web developer",
        description: "Tutorial of RazorPay",
        image: "",
        order_id: data.order.id,
        callback_url: `${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/posttransaction`,
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#121212",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } else {
      if(data.cartClear){
        clearCart();
      }
      toast.error(data.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Head>
        <title>checkout page</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className="container sm:m-auto px-2">
        <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
        <h2 className="font-semibold text-xl">1. Delivery Details</h2>
        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="name"
                placeholder="Enter Your Name"
                onChange={handleChange}
                value={name}
                id="name"
                name="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              {user.email?<input
                type="email"
                value={user.email}
                id="email"
                name="email" readOnly 
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />:<input
              type="email"
              placeholder="Enter Your Email"
              onChange={handleChange}
              value={email}
              id="email"
              name="email" 
              className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />}
            </div>
          </div>
        </div>
        <div className="px-2 w-full">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Address
            </label>
            <textarea
              id="address"
              rows={"2"}
              cols={"30"}
              name="address"
              onChange={handleChange}
              value={address}
              placeholder="Enter Your Current Address"
              className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
        </div>

        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label
                htmlFor="phone"
                className="leading-7 text-sm text-gray-600"
              >
                Phone Number
              </label>
              <input
                type="phone"
                placeholder="Enter Your 10-digit Phone Number"
                onChange={handleChange}
                value={phone}
                id="phone"
                name="phone"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="pincode"
                className="leading-7 text-sm text-gray-600"
              >
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                onChange={handleChange}
                value={pincode}
                id="pincode"
                name="pincode"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label
                htmlFor="state"
                className="leading-7 text-sm text-gray-600"
              >
                State
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={state}
                id="state"
                name="state"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">
                District
              </label>
              <input
                type="city"
                onChange={handleChange}
                value={city}
                id="city"
                name="city"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            </div>
          </div>
        </div>
        <h2 className="font-semibold text-xl">2. Review Cart item & Pay</h2>
        <div className="bg-pink-200 p-6 m-2 ">
          {/* <h2 className="font-bold text-center">Shopping Cart</h2> */}

          <ol className="list-decimal">
            {Object.keys(cart).length === 0 && (
              <div className="my-4 font-normal">Your Cart is Empty</div>
            )}
            {Object.keys(cart).map((item, i) => {
              return (
                <li key={i}>
                  <div className="flex my-3">
                    <div className=" font-semibold">
                      {cart[item].name}({cart[item].size}/{cart[item].variant})
                    </div>
                    <div className="flex items-center justify-center w-1/3 text-lg">
                      <AiOutlinePlusCircle
                        onClick={() =>
                          addToCart(
                            item,
                            1,
                            cart[item].price,
                            cart[item].name,
                            cart[item].size,
                            cart[item].variant
                          )
                        }
                        className="cursor-pointer text-pink-500"
                      />
                      <span className="mx-2">{cart[item].qty}</span>
                      <AiOutlineMinusCircle
                        onClick={() =>
                          removeFromCart(
                            item,
                            1,
                            cart[item].price,
                            cart[item].name,
                            cart[item].size,
                            cart[item].variant
                          )
                        }
                        className="cursor-pointer text-pink-500"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="font-bold">subTotal ₹{subTotal}</div>
        </div>
        <button
          disabled={disabled}
          onClick={checkoutHandler}
          className="disabled:bg-pink-300 flex text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded "
        >
          <BsFillBagCheckFill className="m-1" />
          PayNow ₹{subTotal}
        </button>
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default checkout;

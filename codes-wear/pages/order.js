import { useRouter } from "next/router";
import Order from "@/models/order";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

const OrderStatus = ({ order, clearCart }) => {
  const [date, setDate] = useState()
  const router = useRouter();
  const {clearcart} = router.query;
useEffect(() => {
  const d = new Date(order.createdAt)
  setDate(d)
  if(clearcart==1){
    clearCart();
    }
}, [])

  const products = order.products;
  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Codeswear.com
              </h2>
              <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">
                Order id : #{order.orderId}
              </h1>
              <p className="leading-relaxed mb-4">
                Yayy! your order has been successfully placed.
                </p>
              <p className="leading-relaxed mb-4">
              Order Placed on : <span className="text-slate-700 font-semibold">{date && date.toLocaleDateString("en-IN", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}.</span>
                </p>
                <p>
                  your order status is{" "}
                  <span className="text-slate-700 font-semibold">{order.status}.</span>
                </p>
             
              <div className="flex mb-4">
                <a className="flex-grow py-2 text-lg px-1">Item Description</a>
                <a className="flex-grow border-gray-300 py-2 text-lg px-1">
                  Quantity
                </a>
                <a className="flex-grow border-gray-300 py-2 text-lg px-1">
                  Item Total
                </a>
              </div>

              {Object.keys(products).map((item, i) => {
                return (
                  <div key={i} className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">
                      {products[item].name}({products[item].size}/
                      {products[item].variant})
                    </span>
                    <span className="m-auto text-gray-900">
                      {products[item].qty}
                    </span>
                    <span className="m-auto text-gray-900">
                    ₹{products[item].price} X {products[item].qty} =  ₹{products[item].price*products[item].qty}
                    </span>
                  </div>
                );
              })}

              <div className="flex my-8">
                <span className="title-font font-medium text-2xl text-gray-900">
                  SubTotal: ₹{order.amount}
                </span>
                <button className="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                  Track Order
                </button>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://dummyimage.com/400x400"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let order = await Order.findById(context.query.id);
  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default OrderStatus;

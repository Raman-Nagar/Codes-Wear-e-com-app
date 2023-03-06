import Link from "next/link";
import Product from "@/models/product";
import mongoose from "mongoose";

const Stickers = ({ products }) => {
  // console.log(products)
  return (
    <>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center mx-5">
            {Object.keys(products).length===0 && <p>sorry all the stickers are currently out of stock New stock comming soon</p>}
            {Object.keys(products).map((item) => {
              return (
                <Link
                  key={products[item]._id}
                  href={`product/${products[item].slug}`}
                  className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg m-2"
                >
                  <img
                    alt="ecommerce"
                    className="m-auto h-[40vh] block"
                    src={products[item].img}
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      {products[item].category}
                    </h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {products[item].title}
                    </h2>
                    <p className="mt-1">₹{products[item].price}</p>
                    <div className="mt-1">
                      {products[item].size.includes("s") && <span className="border border-gray-300 px-1 mx-1">S</span>}
                      {products[item].size.includes("M") && <span className="border border-gray-300 px-1 mx-1">M</span>}
                      {products[item].size.includes("L") && <span className="border border-gray-300 px-1 mx-1">L</span>}
                      {products[item].size.includes("XL") && <span className="border border-gray-300 px-1 mx-1">XL</span>}
                      {products[item].size.includes("XXL") && <span className="border border-gray-300 px-1 mx-1">XXL</span>}
                    </div>
                  <div className="mt-1">
                      {products[item].color.map((clr, i)=>{
                        return <button key={i} style={{backgroundColor:clr}} className={`border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none`}></button>
                      })}
                  </div>
                  </div>
                </Link>
              );
            })}
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
  let products = await Product.find({category:"sticker"});
  let stickers = {};
  for (let item of products) {
    if (item.title in stickers) {
      if(!stickers[item.title].color.includes(item.color) && item.availableQty>0){
        stickers[item.title].color.push(item.color)
      }
      if(!stickers[item.title].size.includes(item.size) && item.availableQty>0){
        stickers[item.title].size.push(item.size)
      }
    } else {
      stickers[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        stickers[item.title].color = [item.color];
        stickers[item.title].size = [item.size];
      }else{
        stickers[item.title].color = [];
        stickers[item.title].size = [];
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(stickers)) },
  };
}

export default Stickers;

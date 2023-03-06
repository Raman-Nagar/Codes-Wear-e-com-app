import Link from "next/link";
import Product from "@/models/product";
import mongoose from "mongoose";
import Head from "next/head";

const Mugs = ({ products }) => {
  // console.log(products)
  return (
    <>
    <Head>
        <title>Mugs page</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center mx-5">
          {Object.keys(products).length===0 && <p>sorry all the Mugs are currently out of stock New stock comming soon</p>}
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
  let products = await Product.find({category:"mug"});
  let mugs = {};
  for (let item of products) {
    if (item.title in mugs) {
      if(!mugs[item.title].color.includes(item.color) && item.availableQty>0){
        mugs[item.title].color.push(item.color)
      }
      if(!mugs[item.title].size.includes(item.size) && item.availableQty>0){
        mugs[item.title].size.push(item.size)
      }
    } else {
      mugs[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        mugs[item.title].color = [item.color];
        mugs[item.title].size = [item.size];
      }else{
        mugs[item.title].color = [];
        mugs[item.title].size = [];
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(mugs)) },
  };
}

export default Mugs;

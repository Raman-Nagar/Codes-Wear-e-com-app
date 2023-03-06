import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import {
  AiOutlineShoppingCart,
  AiFillCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { useRouter } from "next/router";

const Navbar = ({
  logOut,
  user,
  cart,
  removeFromCart,
  addToCart,
  clearCart,
  subTotal,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(true);
  const ref = useRef();

  const router = useRouter();

  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let exempted = [
      "/checkout",
      "/order",
      "/orders",
      "/myaccount",
      "/login",
      "/signup",
      "/forgot",
    ];
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
      setHideSidebar(false);
    } else {
      setHideSidebar(true);
    }
  }, [router.query]);

  const togalCart = () =>{
    hideSidebar ? setSidebar(!sidebar) : setSidebar(false);
  }
  return (
    <>
      <div className="sticky top-0 z-20">
        {dropdown && (
          <div
            onMouseOver={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            className="absolute top-9 right-14 bg-white shadow-lg border rounded-md px-5 w-32 text-center z-20"
          >
            <ul>
              <Link href={"/myaccount"}>
                <li className="py-1 text-sm font-bold hover:text-pink-700 ">
                  My Account
                </li>
              </Link>
              <Link href={"/orders"}>
                <li className="py-1 text-sm font-bold hover:text-pink-700 ">
                  My Orders
                </li>
              </Link>
              <li
                onClick={logOut}
                className="py-1 text-sm font-bold hover:text-pink-700 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col md:flex-row md:justify-start justify-center mb-1 py-2 items-center shadow-lg sticky top-0 z-10 bg-white ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="logo md:mx-5 mr-auto">
          <Link href={"/"}>
            <img
              src={"/images/logos/logo-4.png"}
              className="h-10 w-40"
              alt="...hii"
            />
          </Link>
        </div>
        <div className="nav">
          <ul className="flex items-center space-x-6 font-bold md:text-md">
            <li className="hover:text-pink-600">
              <Link href={"/tshirts"}>Tshirts</Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href={"/hoodies"}>Hoodies</Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href={"/stickers"}>Stickers</Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href={"/mugs"}>Mugs</Link>
            </li>
          </ul>
        </div>
        <div className="cart absolute right-0 top-2 mx-5 cursor-pointer flex items-center">
          <span
            onMouseOver={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            {user.value && (
              <MdAccountCircle className="text-xl md:text-3xl mx-2" />
            )}
          </span>
          {!user.value && (
            <Link href={"/login"}>
              <button className="text-sm px-2 py-1 text-white bg-pink-400 rounded-md mx-2">
                Login
              </button>
            </Link>
          )}

          <AiOutlineShoppingCart
            onClick={togalCart}
            className="text-xl md:text-3xl"
          />
        </div>
        <div
          ref={ref}
          className={`absolute top-2 z-30 overflow-y-auto w-72 h-[100vh] bg-pink-100 p-10 transition-all ${
            sidebar ? "right-0" : "-right-72"
          }`}
        >
          <h2 className="font-bold text-center">Shopping Cart</h2>
          <span
            className="absolute top-2 right-2 cursor-pointer text-2xl text-pink-500"
            onClick={togalCart}
          >
            <AiFillCloseCircle />
          </span>
          <ol className="list-decimal">
            {Object.keys(cart).length === 0 && (
              <div className="my-4 font-normal">Your Cart is Empty</div>
            )}
            {Object.keys(cart).map((item, i) => {
              return (
                <li key={i}>
                  <div className="flex my-3 justify-around">
                    <div className="w-2/3 font-semibold">
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
          <div className="font-bold my-2">subTotal ₹{subTotal}</div>
          <div className="flex gap-1">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length === 0}
                className="disabled:bg-pink-300 flex text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded "
              >
                <BsFillBagCheckFill className="m-1" />
                Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              disabled={Object.keys(cart).length === 0}
              className="disabled:bg-pink-300 flex text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded"
            >
              Clearcart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

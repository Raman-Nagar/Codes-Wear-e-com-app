import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadingBar from "react-top-loading-bar";

export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();

  useEffect(() => {
    const RouteChangeStart = () => {
      setProgress(40);
    };
    const RouteChangeComplete = () => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", RouteChangeStart);
    router.events.on("routeChangeComplete", RouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", RouteChangeStart);
      router.events.off("routeChangeComplete", RouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.token, email:myuser.email });
    }
    setKey(Math.random());
  }, [router.query]);

  const saveCart = (mycart) => {
    localStorage.setItem("cart", JSON.stringify(mycart));
    let subt = 0;
    let keys = Object.keys(mycart);
    for (let i = 0; i < keys.length; i++) {
      subt += mycart[keys[i]].price * mycart[keys[i]].qty;
    }
    setSubTotal(subt);
  };
  const addToCart = (itemcode, qty, price, name, size, variant) => {
    if(Object.keys(cart).length==0){
      setKey(Math.random())
    }
    let newCart = cart;
    if (itemcode in cart) {
      newCart[itemcode].qty = newCart[itemcode].qty + qty;
    } else {
      newCart[itemcode] = { qty: 1, price, name, size, variant };
    }
    setCart(newCart);
    saveCart(newCart);
  };
  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const buyNow = (itemcode, qty, price, name, size, variant) => {
    let newCart = {};
    newCart[itemcode] = { qty: 1, price, name, size, variant };
    setCart(newCart);
    saveCart(newCart);
    router.push("/checkout");
  };

  const removeCart = (itemcode, qty, price, name, size, variant) => {
    let newCart = cart;
    if (itemcode in cart) {
      newCart[itemcode].qty = newCart[itemcode].qty - qty;
    }
    if (newCart[itemcode].qty <= 0) {
      delete newCart[itemcode];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const logOut = () => {
    localStorage.removeItem("myuser");
    setKey(Math.random());
    setUser({...user, value: null });
    router.push("/");
  };

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />

      {key && (
        <Navbar
          key={key}
          user={user}
          logOut={logOut}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeCart}
          clearCart={clearCart}
          buyNow={buyNow}
          subTotal={subTotal}
        />
      )}
      <Component
        user={user}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeCart}
        clearCart={clearCart}
        buyNow={buyNow}
        subTotal={subTotal}
        {...pageProps}
      />
      <Footer />
    </>
  );
}

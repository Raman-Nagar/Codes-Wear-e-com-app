import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoIcon from "../src/layouts/logo/LogoIcon";

export default function Index({ res }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleSubmit = () => {
    if (!email || !password) {
      toast.warn("please fill data !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      const user = res.result.filter((curUser) => {
        return curUser.email === email && curUser.password === password;
      });
      if (!user[0]) {
        toast.error("invalid user !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("succesfully login !", {
          position: toast.POSITION.TOP_CENTER,
        });
        localStorage.setItem("admin", JSON.stringify(email));
        // router.push("/")
        window.location = "/";
      }
    }
  };

  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container my-10 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:m-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <div className="flex flex-col gap-4 justify-aroun items-center">
              <LogoIcon />
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                Login Admin
              </h2>
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-black p-3 rounded-full"
            >
              Button
            </button>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const data = await fetch("http://localhost:3001/api/loginserver");
  const res = await data.json();
  return {
    props: { res },
  };
}

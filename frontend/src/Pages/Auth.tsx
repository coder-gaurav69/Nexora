import React, {
  useContext,
  useEffect,
  useState,
  type FormEventHandler,
} from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import image from "../assets/image.png";
import axios from "axios";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import { useNavigate } from "react-router-dom";

type signInType = {
  email: string;
  password: string;
};
type signUpType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Auth = () => {
  const navigate = useNavigate()
  const { setRefreshToken, setAccessToken, setIsLoggedIn , setCustomerId } =
    useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState("signin");
  const [signIn, setSignIn] = useState<signInType>({
    email: "",
    password: "",
  });
  const [signUp, setSignUp] = useState<signUpType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === "signin") {
      const { name, value } = e.target;
      setSignIn((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      {
        const { name, value } = e.target;
        setSignUp((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmitForm = async () => {
    try {
      const url = `http://localhost:3000/api/customAuth/${
        activeTab === "signin" ? "signin" : "signup"
      }`;
      const payload = activeTab === "signin" ? signIn : signUp;
      const response = await axios.post(url, payload, {
        withCredentials: true,
      });
      // const accessToken = response.headers.get("x-access-token");
      // const refreshToken = response.headers.get("x-refresh-token");
      // const customerId = (response?.data as any)?.customerId;
      // setCustomerId(customerId)

      // console.log(accessToken,refreshToken)
      navigate('/');
      // console.log(response);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async ()=>{
    window.open("http://localhost:3000/auth/googleAuth/google","_self")
   
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left Image Section (hidden on small screens) */}
      <div className="hidden md:block md:w-1/2 h-screen fixed top-0 left-0 z-0">
        <img
          src={image}
          alt="Auth Visual"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center w-full md:w-1/2 ml-auto p-6 z-10 min-h-screen ">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          {/* Logo */}
          <div className="text-4xl font-extrabold text-center mb-2">
            <span className="text-blue-600">Nex</span>
            <span className="text-gray-900">ora</span>
          </div>

          <h2 className="text-center text-xl font-semibold text-gray-800 mb-1">
            {activeTab === "signin"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter your details below
          </p>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              className={`w-1/2 py-2 text-sm font-medium transition border-b-2 ${
                activeTab === "signin"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`w-1/2 py-2 text-sm font-medium transition border-b-2 ${
                activeTab === "signup"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitForm();
            }}
          >
            {activeTab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="off"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoComplete="off"
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            {activeTab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
            >
              {activeTab === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button className="w-full border py-2 px-4 flex items-center justify-center rounded-md text-sm hover:bg-gray-100 transition" onClick={handleGoogleLogin}>
            <FcGoogle className="text-lg mr-2" /> Sign in with Google
          </button>

          {/* Bottom Switch */}
          <div className="text-sm text-center text-gray-600 mt-6">
            {activeTab === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("signin")}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

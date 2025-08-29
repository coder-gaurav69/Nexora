import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../Context/GlobalContext";
import axios from "axios";

const Navbar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, customerId, setCustomerId } = useContext(GlobalContext) as any;
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/customAuth/logout`;
      await axios.post(url, { customerId }, { withCredentials: true });

      setIsLoggedIn(false);
      setCustomerId("");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3 md:px-12 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div
        className="text-2xl md:text-3xl font-extrabold cursor-pointer flex items-center"
        onClick={() => navigate("/")}
      >
        <span className="text-blue-600">Nex</span>
        <span className="text-gray-800">ora</span>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <FaUser className="text-gray-700 text-lg md:text-xl" />

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm md:text-base transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:text-base transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

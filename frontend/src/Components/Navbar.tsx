import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaBox, FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isMenuClicked,
    setIsMenuClicked,
    isLoggedIn,
    setIsLoggedIn,
    customerId,
    setCartDetails
  } = useContext(GlobalContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/customAuth/logout`;
      await axios.post(
        url,
        { customerId:customerId },
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      setIsMenuClicked(false);
      setCartDetails([]);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg border-b z-20">
      <div className="w-[90%] mx-auto h-[72px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap"
        >
          <span className="text-blue-600">Nex</span>ora
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-blue-600 transition">
            Shop
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden xsm:flex flex-1 relative max-w-[400px] lg:max-w-[500px] mx-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 border border-gray-200 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 whitespace-nowrap relative">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="text-2xl p-2 rounded-full hover:bg-gray-300 hover:text-yellow-700 transition"
          >
            <HiOutlineShoppingBag />
          </button>

          {/* Desktop Sign In / Sign Up Button */}
          {!isLoggedIn && (
            <div className="hidden sm:inline-block relative p-[2px] rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:300%] animate-border-move">
              <button
                onClick={() => navigate("/auth")}
                className="bg-white text-black text-sm font-semibold px-6 py-2 rounded-md w-full h-full block"
              >
                Sign In / Sign Up
              </button>
            </div>
          )}

          {/* Desktop Profile Dropdown */}
          {isLoggedIn && (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                className="text-2xl text-gray-700 hover:text-blue-600 flex items-center"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <FaUserCircle />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[40px] right-[-50px] mt-2 w-44 bg-white border rounded-md shadow-md p-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-1"
                  >
                    <FaBox className="text-sm" /> Orders
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuClicked(!isMenuClicked)}
            className="sm:hidden text-2xl text-gray-800"
          >
            {isMenuClicked ? <RxCross2 /> : <IoIosMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuClicked && (
        <div className="sm:hidden bg-white border-t px-6 py-4 shadow-md absolute top-[72px] left-0 w-full z-40">
          <div className="space-y-4 text-base text-gray-700 font-medium">
            <Link
              to="/"
              onClick={() => setIsMenuClicked(false)}
              className="block hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMenuClicked(false)}
              className="block hover:text-blue-600"
            >
              Shop
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuClicked(false)}
              className="block hover:text-blue-600"
            >
              Contact
            </Link>

            {!isLoggedIn ? (
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsMenuClicked(false);
                }}
                className="block w-full text-left text-blue-600 font-semibold"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuClicked(false)}
                  className="block hover:text-blue-600"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuClicked(false)}
                  className="block hover:text-blue-600"
                >
                  Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMenuClicked(false)}
                  className="block hover:text-blue-600"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

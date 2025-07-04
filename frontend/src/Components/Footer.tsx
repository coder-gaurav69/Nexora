// src/components/Footer.tsx

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Newsletter */}
      <div className="py-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Newsletter</h2>
        <p className="mb-4">Get updates on new products and offers</p>
        <div className="flex justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-400 rounded-md px-4 py-2 w-72"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="w-[90%] m-auto border-t pt-10 pb-6 px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-md">
              <img src="/favicon.ico" alt="Nexora" className="w-6 h-6" />
            </span>
            Nexora
          </h3>
          <p className="text-sm mb-3">
            Your trusted e-commerce partner, delivering quality products and
            exceptional service since 2020.
          </p>
          <p className="flex items-center gap-2 text-sm">
            <MdLocationOn /> 123 Commerce St, City, State 12345
          </p>
          <p className="flex items-center gap-2 text-sm">
            <MdPhone /> +1 (555) 123-4567
          </p>
          <p className="flex items-center gap-2 text-sm">
            <MdEmail /> support@nexora.com
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Order Status</li>
            <li>Shipping Info</li>
            <li>Returns & Exchanges</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
            <li>Affiliate Program</li>
            <li>Sustainability</li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h4 className="font-semibold mb-3">Connect With Us</h4>
          <p className="mb-3 text-sm">Follow us on social media</p>
          <div className="flex space-x-4 text-xl">
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
          </div>
          <p className="mt-4 mb-2 text-sm">Download our app</p>
          <div className="flex space-x-2">
            <button className="bg-gray-200 px-3 py-2 rounded-md text-sm">
              App Store
            </button>
            <button className="bg-gray-200 px-3 py-2 rounded-md text-sm">
              Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t mt-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm px-6">
        <p>Secure payments with:</p>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <span>💳</span>
          <span>💰</span>
          <span>🏦</span>
          <span>📱</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <p className="flex items-center gap-1">
            🔒 SSL Secured
          </p>
          <p>🚚 Free Shipping</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-200 py-4 text-center text-sm">
        <p>© 2024 <strong>Nexora</strong>. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookies</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

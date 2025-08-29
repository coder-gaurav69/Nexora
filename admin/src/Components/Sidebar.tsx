import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar: React.FC = () => {
  return (
    <div className="w-[18%] min-h-screen border-l border border-t-0 border-[#a9a9a9] text-[max(1vw,10px)]">
      <div className="flex flex-col gap-5 pt-12 pl-[20%]">
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-r-0 rounded-l-sm px-3 py-2 cursor-pointer ${
              isActive ? "bg-[#fff0ed] border-tomato" : "border-[#a9a9a9]"
            }`
          }
        >
          <img src={assets.add_icon} alt="Add" className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-r-0 rounded-l-sm px-3 py-2 cursor-pointer ${
              isActive ? "bg-[#fff0ed] border-tomato" : "border-[#a9a9a9]"
            }`
          }
        >
          <img src={assets.order_icon} alt="List" className="w-5 h-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-r-0 rounded-l-sm px-3 py-2 cursor-pointer ${
              isActive ? "bg-[#fff0ed] border-tomato" : "border-[#a9a9a9]"
            }`
          }
        >
          <img src={assets.order_icon} alt="Orders" className="w-5 h-5" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

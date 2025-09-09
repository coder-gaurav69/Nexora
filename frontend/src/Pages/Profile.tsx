import { useContext, useEffect, useState } from "react";
import { FaUser, FaBox, FaMapMarkerAlt, FaBell, FaCog } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../ContextApi/GlobalVariables";

export default function Profile() {
  const [image, setImage] = useState<string>();
  const [name, setName] = useState<string>();
  const { customerId } = useContext(GlobalContext);
  const [info,setInfo]=useState<any>([])

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        console.log("customerId:", customerId);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/userDetails?customerId=${customerId}`;
        await axios.get(url, { withCredentials: true }).then((res) => {
          setImage((res.data as any).data[0].profilePhoto);
          setName((res.data as any).data[0].name);
          setInfo((res.data as any).data[0])
        });
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchUserDetail();
  }, [customerId]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 mt-[70px]">
        <div className="w-[98%] mx-auto flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 rounded-full flex items-center justify-center">
                <img
                  src={image}
                  alt="profile picture"
                  className="rounded-full w-20 h-20"
                />
              </div>
              <h2 className="font-bold text-lg">{name}</h2>
            </div>
            <nav className="space-y-4">
              <MenuItem icon={<FaUser />} label="Profile" route="" />
              <MenuItem icon={<FaBox />} label="Orders" route="order" />
              <MenuItem
                icon={<FaMapMarkerAlt />}
                label="Addresses"
                route="address"
              />
              <MenuItem
                icon={<FaBell />}
                label="Notifications"
                route="notification"
              />
              <MenuItem icon={<FaCog />} label="Settings" route="setting" />
            </nav>
          </aside>

          {/* nested components */}
          <Outlet context={{setImage,info}} />
        </div>
      </div>
      <Footer />
    </>
  );
}

function MenuItem({
  icon,
  label,
  active,
  route,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  route: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${
        active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => navigate(route)}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </div>
  );
}

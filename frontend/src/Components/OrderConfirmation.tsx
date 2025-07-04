import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";


const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <div className="h-[70px] shadow-md border border-[rgba(0,0,0,0.2)]">
        <div className="w-[90%] m-auto flex justify-between items-center p-5">
          <div className="flex items-center gap-5">
            <Link
          to="/"
          className="text-3xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap"
        >
          <span className="text-blue-600">Nex</span>ora
        </Link>
            <h3 className="text-[rgba(0,0,0,0.6)]">Order Confirmation</h3>
          </div>
        </div>
      </div>


      {/* Confirmation Banner */}
      <div className=" p-6 rounded-md my-5 text-center w-[90%] m-auto">
        <div className="mx-auto flex justify-center p-3 bg-green-100 w-fit h-fit rounded-full my-5">
          <IoMdCheckmarkCircleOutline  className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-black mb-1">
          Order Confirmed!
        </h2>
        <p className="text-gray-600">
          Thank you for your order. we will begin
          processing immediately.
        </p>
        <p className="mt-2">
          <span className="text-blue-700 font-medium bg-blue-100 rounded px-2 py-1 inline-block">
            📦 Tracking Number: TS082243Q7ZIZB
          </span>
        </p>
      </div>

      {/* Continue Shopping Button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

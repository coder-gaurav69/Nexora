import { useContext, useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import { Link } from "react-router-dom";

type CartItem = {
  customerId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageLink: string;
  category: string;
};

const CheckOut = () => {
  const url = useLocation().pathname.split("/");
  const [endPoint, setEndpoint] = useState<string>();
  const [steps, setSteps] = useState<number>(2);
  const { cartDetails, customerId } = useContext(GlobalContext) as {
    cartDetails: CartItem[];
    customerId: string;
  };

  useEffect(() => {
    setEndpoint(url[url.length - 1]);
  }, [url]);

  return (
    <>
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
            <h3 className="text-[rgba(0,0,0,0.6)]">Secure Checkout</h3>
          </div>
          <div className="flex items-center gap-2">
            <FiLock className="text-green-500" />
            <p className="text-md">SSL Secured</p>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="w-[90%] m-auto flex justify-center my-5 overflow-x-scroll sm:overflow-clip scrollbar-hidden">
        {[
          ["Cart", 1],
          ["Shipping", 2],
          ["Payment", 3],
          ["Confirmation", 4],
        ].map(([label, icon], i) => (
          <div className="p-2 flex items-center gap-3" key={i}>
            <div
              className={`h-9 w-9 rounded-full ${
                endPoint == (label as string).toLowerCase()
                  ? "bg-blue-500"
                  : "bg-[rgba(0,0,0,0.2)]"
              } text-white flex items-center justify-center text-md`}
            >
              {endPoint == (label as string).toLowerCase() ? (
                icon
              ) : steps > (icon as number) ? (
                <FaCheck />
              ) : (
                icon
              )}
            </div>
            <h1
              className={`${
                endPoint == (label as string).toLowerCase()
                  ? "text-blue-500"
                  : ""
              } font-semibold text-[rgba(0,0,0,0.6)]`}
            >
              {label}
            </h1>
            {i !== 3 && <div className="h-8 border-r-2 ml-7"></div>}
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="w-[90%] m-auto my-10  grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left part: shipping form and payment method */}
        <div className="order-2 lg:order-1 lg:col-span-3 col-span-full">
          <Outlet
            context={{
              setSteps
            }}
          />
        </div>

        {/* Right part: Order Summary (Sticky) */}
        <div className="lg:col-span-2 col-span-full order-1 lg:order-2">
          <div className="sticky top-[50px] p-6 rounded-md shadow-[0_0_2px_rgba(0,0,0,0.3)] bg-white">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex overflow-auto gap-2">
              {cartDetails.map((e, index) => (
                <div
                  className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg shrink-0 w-full"
                  key={index}
                >
                  <img
                    src={e.imageLink}
                    alt="Keyboard"
                    className="w-[80px] h-[80px] rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{e.productName}</p>
                    <p className="text-sm text-gray-500">{e.category}</p>
                    <p className="text-sm text-gray-500">Qty: {e.quantity}</p>
                  </div>
                  <p className="font-medium">$ {e.price}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 my-4">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 border border-black rounded-md px-3 py-2 outline-none"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                Apply
              </button>
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  &#8377;
                  {cartDetails
                    .reduce(
                      (state, item) => state + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$12.00</span>
              </div>
              <div className="flex justify-between font-semibold text-black pt-2 border-t">
                <span>Total</span>
                <span>
                  $&#8377;
                  {(
                    cartDetails.reduce(
                      (state, item) => state + item.price * item.quantity,
                      0
                    ) + 12
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-green-600">🚚</span>
                <p>Free shipping on orders over $50</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">🔁</span>
                <p>30-day return policy</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">🛡️</span>
                <p>1-year warranty included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;

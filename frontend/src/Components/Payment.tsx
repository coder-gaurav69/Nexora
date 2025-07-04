import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CiCreditCard1, CiDeliveryTruck } from "react-icons/ci";
import { BsExclamationCircle } from "react-icons/bs";
import axios from "axios";
import { GlobalContext } from "../ContextApi/GlobalVariables";

// Razorpay declaration
export {};
declare global {
  interface Window {
    Razorpay: any;
  }
}

type CartItem = {
  customerId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageLink: string;
  category: string;
};

type StepsContextType = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
};

type userType = {
  name: string;
  email: string;
  contact: string;
};

type shippingInfoType = {
  recipientType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

type addressType = {
  street: string;
  optional?: string;
  city: string;
  state: string;
  zip: string;
  instruction?: string;
};

const Payment = () => {
  const navigate = useNavigate();
  const { setSteps } = useOutletContext<StepsContextType>();
  const { customerId, cartDetails, shippingInfo, address } = useContext(
    GlobalContext
  ) as {
    customerId: string;
    cartDetails: CartItem[];
    shippingInfo: shippingInfoType;
    address: addressType;
  };
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const [userInfo, setUserInfo] = useState<userType[]>([]);

  const loadRazorpay = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (): Promise<void> => {
  const res = await loadRazorpay(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const totalAmount = (
    cartDetails.reduce((acc, item) => acc + item.price * item.quantity, 0) + 12
  ).toFixed(2);

  try {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      alert("Order ID not found.");
      return;
    }

    // // ✅ First check payment status before initiating payment
    // const url = `http://localhost:3000/api/getOrderDetails?orderId=${orderId}`;
    // const orderRes = await axios.get(url, { withCredentials: true });
    // const orderData = (orderRes.data as any)?.data[0];

    // if (orderData?.paymentInfo?.status === "Completed") {
    //   alert("Payment for this product has already been done.");
    //   return;
    // }

    // ✅ Proceed to create new order and payment
    const createOrderUrl = "http://localhost:3000/api/razorpay/create-order";
    const result = await axios.post(createOrderUrl, { amount: totalAmount });
    const data: any = result.data;

    const options = {
      key: import.meta.env.VITE_TEST_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Nexora",
      description: "Test Transaction",
      order_id: data.id,
      handler: async function (response: any) {
        try {
          const verifyUrl = "http://localhost:3000/api/razorpay/verify";
          const verifyRes = await axios.post(verifyUrl, response);
          const verifyData: any = verifyRes.data;

          if (verifyData.success) {
            navigate("/confirmation");
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("An error occurred while verifying payment.");
        }
      },
      prefill: {
        name: userInfo[0]?.name,
        email: userInfo[0]?.email,
        contact: userInfo[0]?.contact,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment flow error:", err);
    alert("An error occurred. Please try again.");
  }
};



  const handleCOD = async () => {
    try {
      const orderPayload = {
        customerId: customerId,
        shippingInfo: shippingInfo,
        deliveryAddress: address,
        items: cartDetails.map((e) => ({
          category: e.category,
          imageLink: e.imageLink,
          price: e.price,
          productId: e.productId,
          productName: e.productName,
          quantity: e.quantity,
        })),
        paymentInfo: {
          method: "COD",
          status: "Pending",
        },
        orderStatus: "Placed",
      };

      console.log("Placing Order:", orderPayload);

      const url = "http://localhost:3000/api/createOrder";
      const responseOrder = await axios.post(url, orderPayload, {
        withCredentials: true, // ensure cookies/session sent
      });
      console.log("Order stored:", responseOrder.data);
      // Success feedback to user (uncomment below if using toast)
      // success("Order placed successfully!");
    } catch (error: any) {
      console.error("Error placing order:", error);
      // Failure("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="col-span-3">
      <div className="shadow-[0_0_2px_rgba(0,0,0,0.3)] rounded-md p-6 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Payment Method</h1>
          <p className="text-sm">Step 3 of 4</p>
        </div>

        {/* Online payment */}
        <div className="flex flex-col gap-2 mt-5">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              className="accent-blue-600"
              onClick={() => {
                setIsCashOnDelivery(false);
                setIsOnlinePayment(true);
              }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-semibold">Credit/Debit Card</p>
                <CiCreditCard1 className="text-xl" />
              </div>
              <p className="font-semibold text-[rgba(0,0,0,0.6)]">
                Pay securely with your credit or debit card
              </p>
            </div>
          </label>
        </div>

        {/* Cash on Delivery */}
        <div className="flex flex-col gap-2 mt-5">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              className="accent-blue-600"
              onClick={() => {
                setIsCashOnDelivery(true);
                setIsOnlinePayment(false);
              }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2" onClick={handleCOD}>
                <p className="font-semibold">Cash on Delivery (COD)</p>
                <CiDeliveryTruck className="text-xl" />
              </div>
              <p className="font-semibold text-[rgba(0,0,0,0.6)]">
                Pay when your order is delivered to your doorstep
              </p>
            </div>
          </label>
        </div>

        {/* COD Info Box */}
        {isCashOnDelivery && (
          <div className="bg-[#FFFBEB] border border-[#fcd34d] text-[#92400e] p-4 rounded-md w-full m-auto my-5">
            <div className="flex items-start gap-2">
              <span className="text-xl mt-[2px] text-orange-300">
                <BsExclamationCircle />
              </span>
              <div>
                <p className="font-semibold mb-1">
                  Cash on Delivery Instructions
                </p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Please keep exact change ready</li>
                  <li>COD orders may take 1–2 additional business days</li>
                  <li>Additional COD fee of ₹50 will be added at delivery</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          className="text-sm mt-5 text-white font-semibold px-5 py-2 bg-blue-500 rounded-md w-full"
          onClick={async () => {
            if (isOnlinePayment) {
              await handlePayment();
            } else if (isCashOnDelivery) {
              // COD Order submit logic can go here (optional)
              setSteps((prev) => prev + 1);
              navigate("/confirmation");
            }
          }}
        >
          Continue Order
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-12 mb-10">
        <button
          className="flex gap-4 py-2 px-5 items-center rounded-md shadow-[0_0_2px_rgba(0,0,0,0.2)] font-semibold text-sm hover:bg-[rgba(0,0,0,0.05)]"
          onClick={() => {
            setSteps((prev) => prev - 1);
            navigate("/checkOut/shipping");
          }}
        >
          <FaArrowLeftLong />
          <p>Back to Cart</p>
        </button>
      </div>
    </div>
  );
};

export default Payment;

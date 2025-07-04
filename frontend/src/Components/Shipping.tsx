import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useOutletContext } from "react-router-dom";
import { GlobalContext } from "../ContextApi/GlobalVariables";

type StepsContextType = {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
};

type ShippingInfoType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

type AddressType = {
  street: string;
  optional?: string;
  city: string;
  state: string;
  zip: string;
  instruction?: string;
};

const Shipping = () => {
  const navigate = useNavigate();
  const { setSteps } = useOutletContext<StepsContextType>();
  const { customerId, cartDetails } = useContext(GlobalContext);

  const [recipientType, setRecipientType] = useState<string>("");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [address, setAddress] = useState<AddressType>({
    street: "",
    optional: "",
    city: "",
    state: "",
    zip: "",
    instruction: "",
  });

  const handleShippingInputFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryAddressInputFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (recipientType === "Myself") {
        try {
          const url = `http://localhost:3000/api/userDetails?customerId=${customerId}`;
          console.log("customerId");
          const response = await axios.get(url, { withCredentials: true });
          const fetchedData = (response.data as any)?.data?.[0];

          if (fetchedData?.shippingInfo) {
            setShippingInfo(fetchedData.shippingInfo);
          }

          if (fetchedData?.deliveryAddress) {
            setAddress({
              ...fetchedData.deliveryAddress,
              instruction: "",
            });
          }
        } catch (error) {
          console.log("errror part");
        }
      } else if (recipientType === "Other") {
        const orderId = localStorage.getItem("orderId");
        const url = `http://localhost:3000/api/getOrderDetails?orderId=${orderId}`;
        try {
          const response = (
            (await axios.get(url, { withCredentials: true })).data as any
          )?.data[0];
          console.log("orderId");
          if (response.recipientType === "Other") {
            setRecipientType(recipientType);
            setAddress(response.deliveryAddress);
            setShippingInfo(response.shippingInfo);
          } else {
            setAddress({
              street: "",
              optional: "",
              city: "",
              state: "",
              zip: "",
              instruction: "",
            });
            setShippingInfo({
              firstName: "",
              lastName: "",
              phoneNumber: "",
              email: "",
            });
          }
        } catch (error) {
          setAddress({
            street: "",
            optional: "",
            city: "",
            state: "",
            zip: "",
            instruction: "",
          });
          setShippingInfo({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          });
        }
      }
    };

    fetchUserData();
  }, [recipientType, customerId]);

  useEffect(() => {
    const checkOrder = async () => {
      const orderId = localStorage.getItem("orderId");
      if (orderId) {
        try {
          const url = `http://localhost:3000/api/getOrderDetails?orderId=${orderId}`;
          const response = (
            (await axios.get(url, { withCredentials: true })).data as any
          ).data[0];

          console.log(response);
          setRecipientType(response.recipientType);
          setAddress(response.deliveryAddress);
          setShippingInfo(response.shippingInfo);
        } catch (error) {}
      }
    };
    checkOrder();
  }, []);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      try {
        const orderPayload = {
          customerId,
          recipientType,
          shippingInfo,
          deliveryAddress: address,
          items: cartDetails.map((item: any) => ({
            category: item.category,
            imageLink: item.imageLink,
            price: item.price,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
          })),
          paymentInfo: { status: "Pending" },
          orderStatus: "Pending",
        };

        const url = "http://localhost:3000/api/createOrder";
        const responseOrder = await axios.post(url, orderPayload, {
          withCredentials: true,
        });
        const orderId = (responseOrder.data as any)?.orderId;

        localStorage.setItem("orderId", orderId);
        navigate("/checkOut/payment");
      } catch (error) {
        console.error("Error creating order:", error);
      }
    } else {
      try {
        const url = `http://localhost:3000/api/updateOrder/${orderId}`;
        const response = await axios.patch(
          url,
          {
            shippingInfo,
            deliveryAddress: address,
            recipientType,
          },
          { withCredentials: true }
        );
        navigate("/checkOut/payment")
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <form
        className="shadow-[0_0_2px_rgba(0,0,0,0.3)] rounded-md p-6 bg-white"
        onSubmit={handleSubmitForm}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Shipping Information</h1>
          <p className="text-sm">Step 2 of 4</p>
        </div>

        <p className="font-semibold text-md mt-5">Who is this delivery for?</p>
        <p className="text-[rgba(0,0,0,0.6)] mt-3">
          Choose the recipient for this order
        </p>

        <div className="flex flex-col gap-2 mt-1">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="delivery"
              value="Myself"
              className="accent-blue-600"
              checked={recipientType === "Myself"}
              onChange={() => setRecipientType("Myself")}
            />
            <p className="text-[rgba(0,0,0,0.6)]">Myself</p>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="delivery"
              value="Other"
              className="accent-blue-600"
              checked={recipientType === "Other"}
              onChange={() => setRecipientType("Other")}
            />
            <p className="text-[rgba(0,0,0,0.6)]">
              Someone else (Gift delivery)
            </p>
          </label>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-10 mt-5">
          {[
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
          ].map(([name, label], i) => (
            <div className="flex flex-col" key={i}>
              <label className="font-semibold my-2 text-sm">{label}</label>
              <input
                type="text"
                name={name}
                value={shippingInfo?.[name as keyof ShippingInfoType] ?? ""}
                required
                className="rounded-md p-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
                onChange={handleShippingInputFields}
              />
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col mt-5">
          <label className="text-sm font-semibold my-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={shippingInfo?.phoneNumber ?? ""}
            className="rounded-md px-2 py-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
            required
            onChange={handleShippingInputFields}
          />
          <p className="text-[rgba(0,0,0,0.6)] my-2">
            We'll use this to contact you about your delivery
          </p>
        </div>

        <div className="flex flex-col my-2">
          <label className="text-sm font-semibold my-2">Email address</label>
          <input
            type="email"
            name="email"
            className="rounded-md p-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
            value={shippingInfo?.email ?? ""}
            required
            onChange={handleShippingInputFields}
          />
          <p className="text-[rgba(0,0,0,0.6)] my-2">
            For order confirmation and tracking updates
          </p>
        </div>

        <hr className="h-[0.5px] bg-[rgba(0,0,0,0.2)] my-10 border-none" />

        {/* Address */}
        <h1 className="mt-5 text-xl font-semibold">Delivery Address</h1>

        <div className="flex flex-col mt-5">
          <label className="text-sm font-semibold my-2">Street address</label>
          <input
            type="text"
            name="street"
            value={address?.street ?? ""}
            className="rounded-md p-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
            required
            onChange={handleDeliveryAddressInputFields}
          />
        </div>

        <div className="flex flex-col mt-5">
          <label className="text-sm font-semibold my-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            name="optional"
            value={address?.optional ?? ""}
            className="rounded-md p-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
            onChange={handleDeliveryAddressInputFields}
          />
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5">
          {[
            ["city", "City"],
            ["state", "State / Province"],
            ["zip", "ZIP / Postal code"],
          ].map(([name, label], i) => (
            <div className="flex flex-col my-2" key={i}>
              <label className="text-sm font-semibold my-2">{label}</label>
              <input
                type="text"
                name={name}
                value={address?.[name as keyof AddressType] ?? ""}
                className="rounded-md p-1 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500"
                required
                onChange={handleDeliveryAddressInputFields}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-5">
          <label className="text-sm font-semibold my-2">
            Delivery instructions (optional)
          </label>
          <textarea
            name="instruction"
            value={address?.instruction ?? ""}
            className="rounded-md p-2 shadow-[0px_0px_2px_rgba(0,0,0,0.2)] outline-blue-500 min-h-[100px]"
            onChange={(e) =>
              setAddress((prev) => ({
                ...prev,
                instruction: e.target.value,
              }))
            }
          />
        </div>

        <button className="text-sm mt-5 text-white font-semibold px-5 py-2 bg-blue-500 rounded-md w-full">
          Continue to Payment
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-12 mb-10">
        <button
          className="flex gap-4 py-2 px-5 items-center rounded-md shadow-[0_0_2px_rgba(0,0,0,0.2)] font-semibold text-sm hover:bg-[rgba(0,0,0,0.05)]"
          onClick={() => {
            setSteps((prev) => prev - 1);
            navigate("/cart");
          }}
        >
          <FaArrowLeftLong />
          <p>Back to Cart</p>
        </button>
      </div>
    </>
  );
};

export default Shipping;

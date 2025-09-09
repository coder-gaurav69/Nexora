import React, { useState, useContext, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Success,Failure } from "../Components/Toast";
import Footer from "../Components/Footer";


type CartItem = {
  customerId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageLink: string;
  category:string
};


const Cart = () => {
  const navigate = useNavigate();
  const { cartDetails, setCartDetails, customerId,isLoggedIn} = useContext(GlobalContext) as {
    cartDetails: CartItem[];
    setCartDetails: React.Dispatch<React.SetStateAction<CartItem[]>>;
    customerId:string,
    isLoggedIn:boolean
  };

  const [quantities, setQuantities] = useState<number[]>([]);

  useEffect(() => {
    if (cartDetails.length > 0) {
      setQuantities(cartDetails.map((item) => item.quantity || 1));
    }
  }, [cartDetails]);

  const handleDelete = async (customerId: string, productId: string) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/userCartData/deleteItem`;

      const payload = {
        customerId,
        productId,
      };
      const response = await axios.delete(url, {
        data: payload,
        withCredentials: true,
      } as any);
      console.log(response?.data)
      // Success('Cart updated successfully.')
      Success((response?.data as any).message)
    } catch (error) {
      console.error("Delete failed:", error);
      Failure('Cart update failed. Check your connection and retry.')
    }
  };

  const updateQuantity = async (
    customerId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/userCartData/update`;
      const payload = {
        customerId,
        productId,
        quantity,
      };

      const response = await axios.patch(url, payload, {
        withCredentials: true,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/userCartData?customerId=${customerId}`;
        const response = await axios.get<{ data: CartItem[] }>(url, {
          withCredentials: true,
        });

        setCartDetails(response?.data?.data);
      } catch (error) {
        console.log("Failed to load cart", error);
      }
    };

    if (isLoggedIn && customerId) {
      fetchCartData();
    }
  }, [isLoggedIn, customerId]);


  useEffect(()=>{
    window.scrollTo({top:0,left:0})
  },[])

  return (
    <>
      <Navbar />
      <div className="mt-[75px] w-[90%] m-auto flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div
          className={`${
            cartDetails.length > 0 ? "basis-[70%]" : "w-full"
          } flex flex-col gap-3 overflow-y-scroll h-[500px] scrollbar-hidden mb-[10px] lg:mb-[50px]`}
        >
          <h1 className="text-3xl font-bold my-5">Shopping Cart</h1>

          {/* ✅ Improved Empty Cart */}
          {cartDetails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center w-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                alt="Empty Cart"
                className="w-[150px] h-[150px] mb-6 opacity-70"
              />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-4">
                Looks like you haven't added anything yet.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition"
                onClick={() => navigate("/")} // Change route if needed
              >
                Continue Shopping
              </button>
            </div>
          )}

          {cartDetails.map((item, index) => (
            <div
              className="border border-[rgba(0,0,0,0.1)] shadow-md flex gap-4 items-center rounded-md p-2 overflow-x-scroll scrollbar-hidden shrink-0 text-nowrap"
              key={index}
            >
              <div className="w-[80px] h-[80px] rounded-md flex items-center">
                <img
                  src={item.imageLink}
                  alt={item.productName}
                  className="rounded-md w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="font-semibold">{item.productName}</h1>
                <h2 className="text-[rgba(0,0,0,0.7)]">₹{item.price}</h2>
              </div>

              <div className="flex gap-5 my-5 flex-col xsm:flex-row ml-auto">
                <div className="border border-[rgba(0,0,0,0.2)] flex w-full justify-between xsm:w-fit rounded-md">
                  <div
                    className="m-1 p-2 hover:bg-yellow-400 rounded-sm flex items-center cursor-pointer"
                    onClick={() => {
                      const newCartDetails = [...cartDetails];
                      const newQuantity = Math.max(
                        1,
                        newCartDetails[index].quantity - 1
                      );
                      newCartDetails[index].quantity = newQuantity;
                      setCartDetails(newCartDetails);
                      updateQuantity(
                        item.customerId,
                        item.productId,
                        newQuantity
                      );
                    }}
                  >
                    <FaMinus />
                  </div>

                  <input
                    type="number"
                    min={1}
                    value={quantities[index] || 1}
                    className="outline-none w-[50px] text-center transition-transform duration-200 border focus:border-2 rounded-md"
                    onFocus={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      const newQuantities = [...quantities];
                      newQuantities[index] = value;
                      setQuantities(newQuantities);
                    }}
                  />

                  <div
                    className="p-2 m-1 hover:bg-yellow-400 rounded-sm flex items-center cursor-pointer"
                    onClick={() => {
                      const newCartDetails = [...cartDetails];
                      const newQuantity = newCartDetails[index].quantity + 1;
                      newCartDetails[index].quantity = newQuantity;
                      setCartDetails(newCartDetails);
                      updateQuantity(
                        item.customerId,
                        item.productId,
                        newQuantity
                      );
                    }}
                  >
                    <FaPlus />
                  </div>
                </div>
              </div>

              <div className="font-semibold text-gray-700">
                ₹{(item.price * quantities[index]).toFixed(2)}
              </div>

              <div
                className="text-red-600 mr-3 cursor-pointer"
                onClick={() => {
                  setCartDetails(cartDetails.filter((_, i) => i !== index));
                  setQuantities(quantities.filter((_, i) => i !== index));
                  handleDelete(item.customerId, item.productId);
                }}
              >
                <RiDeleteBinLine size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        {cartDetails.length > 0 && (
          <div className="border my-[10px] lg:my-[87px] border-[rgba(0,0,0,0.1)] shadow-md p-3 basis-[30%] rounded-md h-fit sticky top-[130px] bg-white">
            <h1 className="text-xl font-semibold my-2">Order Summary</h1>

            <div className="flex justify-between p-2">
              <h1>Subtotal</h1>
              <span>
                ₹
                {cartDetails
                  .reduce(
                    (sum, item, index) => sum + item.price * quantities[index],
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between p-2">
              <h1>Shipping</h1>
              <span>₹9.99</span>
            </div>

            <div className="flex justify-between p-2">
              <h1>Tax</h1>
              <span>₹7.20</span>
            </div>

            <hr className="shadow-lg" />

            <div className="flex justify-between p-2 font-semibold text-lg">
              <h1>Total</h1>
              <span>
                ₹
                {(
                  cartDetails.reduce(
                    (sum, item, index) => sum + item.price * quantities[index],
                    0
                  ) +
                  9.99 +
                  7.2
                ).toFixed(2)}
              </span>
            </div>

            <button
              className="py-3 my-3 bg-[#2094F3] rounded-md w-full text-white font-semibold text-[13px] cursor-pointer"
              onClick={() => navigate("/checkOut")}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default Cart;

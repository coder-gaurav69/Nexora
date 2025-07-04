import { useContext } from "react";
import { Link } from "react-router-dom";
import StarRatingUsingNumber from "./Review/StarRatingUsingNumber";
import axios from "axios";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import { Success, Failure } from "./Toast";
// import {toast} from 'sonner'

type itemType = {
  productName: string;
  rating: number;
  description: string;
  price: number;
  category: string;
  imageLink: string;
  id: string;
};

const Product = ({
  productName,
  rating,
  description,
  price,
  imageLink,
  id,
  category,
}: itemType) => {
  const { customerId } = useContext(GlobalContext);

  interface AddToCartResponse {
  success: boolean;
  message: string;
}

const handleAddToCart = async () => {
  try {
    const url = "http://localhost:3000/api/add-cart-product";

    const payload = {
      customerId,
      productId: id,
      productName,
      imageLink,
      quantity: 1,
      price,
      category,
    };

    const response = await axios.post<AddToCartResponse>(url, payload, {
      withCredentials: true,
    });

    if (response.data.success) {
      Success(response.data.message || "Item added to your cart successfully!");
    } else {
      Failure(response.data.message || "Something went wrong. Please try again.");
    }

  } catch (error: any) {
    Failure(
      error?.response?.data?.message ||
      "Failed to add the product. Please try again."
    );
  }
};



  return (
    <div className="w-[260px] flex flex-col rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 py-5">
      {/* Image Container */}
      <div className="h-[200px] w-full overflow-hidden bg-gray-50 rounded-t-xl flex items-center justify-center">
        <div className="w-full h-full overflow-hidden rounded-t-xl">
          <img
            src={imageLink}
            alt={productName}
            className="h-full w-full object-contain scale-100 transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Product Title */}
      <h2 className="text-center font-semibold mt-3 px-2 text-lg line-clamp-2">
        {productName}
      </h2>

      {/* Ratings */}
      <div className="flex items-center justify-between mx-4 mt-2 mb-1">
        <div className="flex text-yellow-400">
          <StarRatingUsingNumber rating={rating} />
        </div>
        <span className="text-sm text-gray-500">{rating}</span>
      </div>

      {/* Description */}
      <p className="text-center text-sm text-gray-600 px-3 mb-2 line-clamp-2">
        {description.length > 60
          ? description.slice(0, 60) + "..."
          : description}
      </p>

      {/* Price + View Button */}
      <div className="flex justify-between items-center px-4 mt-auto mb-3">
        <span className="text-blue-600 font-bold text-xl">&#x20B9;{price}</span>
        <Link to={`/product/${id}`}>
          <button className="px-4 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition">
            View
          </button>
        </Link>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        className="mx-4 mb-4 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;

import React, { useContext, useEffect, useState } from "react";
import StarRatingUsingNumber from "./StarRatingUsingNumber";
import { IoMdStar } from "react-icons/io";
import { GlobalContext } from "../../ContextApi/GlobalVariables";
import ReviewTemplat from "./ReviewTemplat";
import axios from "axios";

interface ReviewSectionProps {
  productName: string;
  rating: string;
  ratingBreakdown: { stars: number; percentage: number }[];
}

type reviewType = {
  name: string;
  title: string;
  review: string;
  productReviewImages: string[];
  rating: number;
  date: string;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productName,
  rating,
  ratingBreakdown,
}) => {
  const { setOpenReviewForm } = useContext(GlobalContext);
  const [reviews, setReviews] = useState<reviewType[]>([]);

  useEffect(()=>{
    const loadReviews = async ()=>{
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/reviews`;
        const response = ((await axios.get(url,{withCredentials:true})).data as any)?.data;
        console.log(response)
        setReviews(response)
      } catch (error) {
        console.log(error)
      }
    }
    loadReviews()
  },[])







  return (
    <div className="w-[100%] my-10 flex flex-col m-auto">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-center">Customer Reviews</h1>
        <p className="text-xl text-[rgba(0,0,0,0.8)] text-center">
          {`See what our customers are saying about our ${productName}`}
        </p>
      </div>

      {/* Ratings Summary */}
      <div className="flex my-10 flex-col gap-5 lg:flex-row bg-white shadow-sm rounded-xl border border-gray-200 px-10 py-10">
        <div className="flex flex-1 flex-col md:flex-row gap-5">
          {/* Left: Average Rating */}
          <div className="flex gap-2 flex-wrap items-center mx-5">
            <label className="text-6xl font-extrabold text-[rgba(0,0,0,0.7)]">
              {rating}
            </label>
            <div className="flex flex-col text-[13px] text-[rgba(0,0,0,0.5)]">
              <StarRatingUsingNumber rating={parseFloat(rating)} />
              <p>out of 5</p>
            </div>
          </div>

          {/* Middle: Breakdown */}
          <div className="flex flex-col gap-2 flex-1 mx-5">
            {ratingBreakdown.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-2">
                {/* Star Label */}
                <div className="w-6 flex items-center justify-end font-medium">
                  {stars}
                  <IoMdStar className="text-yellow-500 ml-1" size={16} />
                </div>

                {/* Bar */}
                <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Percent */}
                <div className="w-10 text-right text-sm text-gray-700">
                  {percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex items-center mx-5 hover:scale-105 transition-transform duration-300">
          <button
            className="text-xl font-semibold text-white bg-blue-600 px-6 py-2 rounded-md lg:w-fit w-full text-nowrap"
            onClick={() => setOpenReviewForm(true)}
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* users reviews */}
      {reviews.map(
        ({ name, title, review, productReviewImages, rating, date }, index) => (
          <div key={index} className="my-3">
            <ReviewTemplat
              name={name}
              title={title}
              review={review}
              productReviewImages={productReviewImages}
              rating={rating}
              date={date}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReviewSection;

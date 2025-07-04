import React from 'react';
import { IoMdStar } from "react-icons/io";
import StarRating from './StarRatingUsingNumber';

const ReviewTemplat = ({
  name,
  title,
  review,
  productReviewImages,
  rating,
  date
}: {
  name: string;
  title: string;
  review: string;
  productReviewImages: string[];
  rating: number;
  date: string;
}) => {

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className='p-5 bg-white shadow-sm rounded-xl border border-gray-200 max-w-full w-full'>
      
      {/* Top Row */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start'>
        {/* Left: Avatar + Name + Stars */}
        <div className='flex'>
          <div className='h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-lg font-semibold'>
            {initials}
          </div>
          <div className='ml-4'>
            <h1 className='font-bold text-gray-800 text-sm sm:text-base'>{name}</h1>
            <div className='flex flex-wrap items-center gap-2 mt-1'>
              <StarRating rating={rating} />
              <span className='bg-green-600 text-white text-xs px-2 py-[5px] font-semibold rounded-full'>
                ✓ Verified Purchase
              </span>
            </div>
          </div>
        </div>

        {/* Right: Date */}
        <div className='text-sm text-gray-400 mt-2 sm:mt-0'>
          {date}
        </div>
      </div>

      {/* Title */}
      <h2 className='text-lg font-bold mt-4 text-gray-900'>
        {title}
      </h2>

      {/* Review Text */}
      <p className='text-gray-700 mt-2 text-sm sm:text-base'>
        {review}
      </p>

      {/* Images */}
      {productReviewImages.length > 0 && (
        <div className='flex gap-2 overflow-x-auto my-4 scrollbar-hidden'>
          {productReviewImages.map((url, index) => (
            <div key={index} className='h-[100px] w-[100px] flex-shrink-0'>
              <img
                src={url}
                alt={`review-${index}`}
                className='rounded-md object-cover w-full h-full border border-gray-300'
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex flex-wrap gap-5 items-center text-sm text-gray-500 border-t pt-3'>
        <button className='flex items-center gap-1 hover:text-black'>
          👍 Helpful (12)
        </button>
        <button className='flex items-center gap-1 hover:text-black'>
          👎 Not helpful (1)
        </button>
        <button className='hover:text-black'>
          🚩 Report
        </button>
      </div>
    </div>
  );
};

export default ReviewTemplat;

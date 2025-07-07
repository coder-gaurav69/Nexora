import React, { useContext, useEffect, useState } from "react";
import StarRatingWithTouch from "./StarRatingWithTouch";
import { IoClose } from "react-icons/io5";
import { GlobalContext } from "../../ContextApi/GlobalVariables";
import axios from "axios";

const ReviewForm = () => {
  const [title, setTitle] = useState<string | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const { closePopup } = useContext(GlobalContext);

  useEffect(() => {
    console.log({ title, review, images, name, rating });
  }, [title, review, images, name, rating]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/post-review`;
    const payload = {
      title,
      review,
      images,
      name,
      rating,
    };

    try {
      const response = await axios.post(url, payload, {
        withCredentials: true,
      });
      console.log("Review submitted successfully:", response.data);
      closePopup();
    } catch (error: any) {
      console.error(
        "Error submitting review:",
        error.response?.data || error.message
      );
      closePopup()
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-[90%] md:w-[70%] lg:w-[60%] m-auto  px-4 py-8 shadow-md h-[550px] overflow-y-scroll bg-white rounded-md
      "
    >
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Write a Review</h1>
        <IoClose
          className="font-bold text-4xl hover:scale-110 transition-transform duration-200"
          onClick={closePopup}
        />
      </div>

      {/* Star Rating */}
      <h2 className="font-semibold text-[rgba(0,0,0,0.8)]">Overall Rating *</h2>
      <StarRatingWithTouch />

      {/* Review Title */}
      <label htmlFor="title" className="font-semibold text-[rgba(0,0,0,0.8)]">
        Review Title *
      </label>
      <input
        type="text"
        id="title"
        required
        placeholder="Summarize your experience"
        className="py-2 px-2 rounded-md border border-gray-300"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Review Textarea */}
      <label htmlFor="review" className="font-semibold text-[rgba(0,0,0,0.8)]">
        Your Review *
      </label>
      <textarea
        id="review"
        required
        minLength={50}
        className="min-h-[100px] rounded-md px-4 py-2 border border-gray-300"
        placeholder="Tell others about your experience with this product"
        onChange={(e) => setReview(e.target.value)}
      />
      <p>Minimum 50 characters</p>

      {/* File Upload */}
      <label htmlFor="photo" className="font-semibold text-[rgba(0,0,0,0.8)]">
        Add Photos (Optional)
      </label>
      <div className="border-2 border-dotted border-gray-300 py-10 rounded-md flex items-center justify-center">
        <input
          type="file"
          id="photo"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
        />
      </div>

      {/* Name */}
      <label htmlFor="name" className="font-semibold text-[rgba(0,0,0,0.8)]">
        Your Name *
      </label>
      <input
        type="text"
        id="name"
        required
        className="py-2 px-2 rounded-md border border-gray-300"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Terms Checkbox */}
      <div className="flex gap-5 items-start">
        <input type="checkbox" required className="scale-110 mt-1" />
        <p>
          I agree that this review is based on my own experience and is my
          genuine opinion of this product, and that I have no personal or
          business relationship with this company.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="px-5 py-2 border border-gray-300 rounded-md flex-1 font-semibold"
          onClick={() => {
            // Reset or cancel logic here
            setTitle(null);
            setReview(null);
            setImages([]);
            setName(null);
            setRating(0);
            closePopup();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 border border-gray-300 rounded-md flex-1 bg-blue-600 text-white font-semibold"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

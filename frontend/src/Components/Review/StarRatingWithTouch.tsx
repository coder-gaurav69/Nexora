import React from 'react';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';

interface StarRatingProps {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

const StarRatingWithTouch: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const handleClick = (
    event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>,
    starValue: number
  ) => {
    const clientX =
      'touches' in event
        ? event.touches[0].clientX
        : (event as React.MouseEvent).clientX;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const relativeX = clientX - left;
    const isHalf = relativeX < width / 2;
    const finalRating = isHalf ? starValue - 0.5 : starValue;

    setRating(finalRating);
  };

  const getStarIcon = (index: number) => {
    if (rating >= index) return <IoMdStar />;
    if (rating >= index - 0.5) return <IoMdStarHalf />;
    return <IoMdStarOutline />;
  };

  const getStarColor = (index: number): string => {
    return rating >= index - 0.5 ? '#EAB308' : 'rgba(0, 0, 0, 0.2)';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex text-3xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={(e) => handleClick(e, star)}
            onTouchStart={(e) => handleClick(e, star)}
            className="cursor-pointer transition-transform duration-150 hover:scale-110"
            style={{ color: getStarColor(star) }}
          >
            {getStarIcon(star)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRatingWithTouch;

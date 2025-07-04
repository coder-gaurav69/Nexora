import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number; // default 5
  className?: string; // for styling (optional)
}

const StarRatingUsingNumber: React.FC<StarRatingProps> = ({ rating, maxStars = 5, className = "" }) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(<IoMdStar key={i} className="text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(<IoMdStarHalf key={i} className="text-yellow-400" />);
    } else {
      stars.push(<IoMdStarOutline key={i} className="text-gray-300" />);
    }
  }

  return <div className={`flex gap-1 text-xl ${className}`}>{stars}</div>;
};

export default StarRatingUsingNumber;

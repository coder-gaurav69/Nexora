import { useNavigate } from "react-router-dom";

const Category = ({
  category,
  imageLink,
}: {
  category: string;
  imageLink: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 bg-white shadow-md hover:shadow-lg transition rounded-xl border border-gray-200 shrink-0 w-[260px] sm:w-[280px] md:w-[300px]" onClick={()=>navigate(`/shop/${category}`)}>
      <div className="w-full h-[180px] overflow-hidden rounded-t-xl flex items-center justify-center bg-gray-50">
        <img
          src={imageLink}
          alt={category}
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h1 className="text-lg sm:text-xl font-semibold text-center px-3 py-3 line-clamp-1">
        {category}
      </h1>
    </div>
  );
};

export default Category;

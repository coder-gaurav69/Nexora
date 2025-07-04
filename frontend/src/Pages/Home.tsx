import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import ImageCarousel from "../Components/ImageCarousel";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import "../index.css";
import Category from "../Components/Category";
import Product from "../Components/Product";
import axios from "axios";
import Footer from "../Components/Footer";

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  type ColorImage = {
    color: string;
    imageList: string[];
  };

  type ProductType = {
    _id: string;
    productName: string;
    ratings: number;
    description: string;
    price: number;
    category: string;
    brandType: string;
    features: string[];
    productDetails: string;
    boxContents: string[];
    colorsAvailable: ColorImage[];
    materialMadeUp?: string;
    sizesAvailable?: string[];
  };

  const [productList, setProductList] = useState<ProductType[]>([]);
  const [categoryCards, setCategoryCards] = useState<
    { category: string; image: string }[]
  >([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:3000/api/products";
        const response = await axios.get<{ data: ProductType[] }>(url, {
          withCredentials: true,
        });
        setProductList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryMap = new Map<string, string>();
    productList.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        const image = product.colorsAvailable?.[0]?.imageList?.[0] || "";
        categoryMap.set(product.category, image);
      }
    });

    const uniqueCategoryCards = Array.from(categoryMap.entries()).map(
      ([category, image]) => ({ category, image })
    );

    setCategoryCards(uniqueCategoryCards);
  }, [productList]);

  return (
    <div className="text-dark">
      <Navbar />
      <ImageCarousel />

      {/* --- Category Section --- */}
      <div className="mt-16 mb-16 px-4 flex flex-col gap-8 relative">
        <h1 className="text-3xl font-bold text-center">Shop by Category</h1>
        <div className="flex items-start relative">
          {/* left scroll btn */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-[300px] hidden md:flex items-center justify-center p-2 text-2xl bg-white border rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <FaCaretLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex m-auto w-[90%] gap-10 overflow-x-scroll scrollbar-hidden scroll-smooth px-4"
          >
            {categoryCards.map(({ category, image }, index) => (
              <Category category={category} imageLink={image} key={index} />
            ))}
          </div>

          {/* right scroll btn */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-[300px] hidden md:flex items-center justify-center p-2 text-2xl bg-white border rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <FaCaretRight />
          </button>
        </div>
      </div>

      {/* --- Featured Products Section --- */}
      <div className="w-full bg-[#F9FAFB] py-14 px-4">
        <div className="w-[90%] mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            Featured Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {productList.map((item, index) => (
              <Product
                productName={item.productName}
                rating={item.ratings}
                description={item.description}
                price={item.price}
                imageLink={item.colorsAvailable?.[0]?.imageList[0]}
                id={item._id}
                category={item.category}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;

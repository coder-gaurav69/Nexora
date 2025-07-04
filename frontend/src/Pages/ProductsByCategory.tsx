import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Product from "../Components/Product";
import axios from "axios";
import BreadcrumbNavigation from "../Components/BreadcumNavigation";

const ProductsByCategory = () => {
  const { selectedCategory } = useParams<string>();
  const navigate = useNavigate();

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

  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(1000);

  useEffect(() => {
    const filterProducts = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`;
        const response = await axios.get<{ data: ProductType[] }>(url, {
          withCredentials: true,
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    filterProducts();
  }, [selectedCategory]);

  useEffect(() => {
    setCategoryList(
      Array.from(new Set(products.map((e) => e.category?.trim() || "")))
    );

    setBrands(
      Array.from(
        new Set(
          products
            .filter(
              (e) =>
                selectedCategories.length === 0 ||
                selectedCategories.includes(e.category.trim())
            )
            .map((e) => e.brandType?.trim())
            .filter((b): b is string => Boolean(b))
        )
      )
    );
  }, [products, selectedCategories]);

  useEffect(() => {
    if (!selectedCategory || selectedCategory === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(selectedCategory.split(",").map((c) => c.trim()));
    }
  }, [selectedCategory]);

  const handleCategoryToggle = (category: string) => {
    const categoryNormalized = category.trim();
    const updated = selectedCategories.includes(categoryNormalized)
      ? selectedCategories.filter((c) => c !== categoryNormalized)
      : [...selectedCategories, categoryNormalized];
    navigate(`/shop/${updated.length > 0 ? updated.join(",") : "All"}`);
  };

  const handleBrandToggle = (brand: string) => {
    const brandTrimmed = brand.trim();
    const updated = selectedBrands.includes(brandTrimmed)
      ? selectedBrands.filter((b) => b !== brandTrimmed)
      : [...selectedBrands, brandTrimmed];
    setSelectedBrands(updated);
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "low", label: "Price: Low to High" },
    { value: "high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  useEffect(() => {
    const handleClick = () => setIsSortOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const getSortedProducts = () => {
    const filtered = products.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category.trim());

      const brandMatch =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brandType.trim());

      const priceMatch = p.price <= priceRange;

      return categoryMatch && brandMatch && priceMatch;
    });

    switch (sortOption) {
      case "low":
        return filtered.sort((a, b) => a.price - b.price);
      case "high":
        return filtered.sort((a, b) => b.price - a.price);
      case "newest":
        return filtered.sort((a, b) => b._id.localeCompare(a._id));
      default:
        return filtered;
    }
  };

  const finalProducts = getSortedProducts();

  return (
    <>
      <Navbar />
      <div className="w-[90%] m-auto mt-[100px] mb-10">
        <BreadcrumbNavigation />

        <div className="flex justify-between items-center flex-wrap my-5">
          <div className="sm:w-[70%] w-[100%]">
            <h1 className="font-semibold text-2xl md:text-3xl truncate overflow-hidden whitespace-nowrap w-[90%]">
              {selectedCategory} Products
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium text-gray-700">Sort by:</h1>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortOpen(!isSortOpen);
                }}
                className="px-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm bg-white w-[200px] flex justify-between"
              >
                {sortOptions.find((opt) => opt.value === sortOption)?.label}
                <span className="ml-1">▼</span>
              </button>

              {isSortOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg p-2">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setIsSortOpen(false);
                      }}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-yellow-400 rounded-md"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-5 md:flex-row flex-col">
          <div className="basis-[25%]">
            <div className="sticky top-[130px] max-h-[calc(100vh-150px)] overflow-y-auto shadow-md border rounded-md p-3 h-fit">
              <div className="flex justify-between items-center">
                <h1 className="font-semibold text-xl">Filters</h1>
                <button
                  className="py-2 px-5 hover:bg-yellow-600 text-sm text-blue-400 hover:text-white font-semibold rounded-md"
                  onClick={() => {
                    navigate("/shop/All");
                    setSelectedBrands([]);
                    setPriceRange(1000);
                  }}
                >
                  Clear All
                </button>
              </div>

              <div className="my-3">
                <h1 className="font-semibold">Categories</h1>
                <div className="list-none">
                  {categoryList.map((e, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500"
                        checked={selectedCategories.includes(e.trim())}
                        onChange={() => handleCategoryToggle(e)}
                      />
                      <li className="p-1">{e}</li>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h1 className="font-semibold mt-5">Price Range</h1>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />
                <div className="flex justify-between text-[rgba(0,0,0,0.5)] font-semibold">
                  <label>₹0</label>
                  <label>₹{priceRange}</label>
                </div>
              </div>

              <div className="flex flex-col my-5">
                <h1 className="font-semibold">Brands</h1>
                <div className="list-none">
                  {brands.map((e, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500"
                        checked={selectedBrands.includes(e.trim())}
                        onChange={() => handleBrandToggle(e)}
                      />
                      <li className="p-1">{e}</li>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="basis-[75%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
            {finalProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              finalProducts.map((item, index) => (
                <Product
                  key={index}
                  id={item._id}
                  productName={item.productName}
                  rating={item.ratings}
                  description={item.description}
                  price={item.price}
                  imageLink={item.colorsAvailable[0]?.imageList[0]}
                  category={item.category}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsByCategory;

import { useRef, useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import ReviewSection from "../Components/Review/ReviewSection";
import Product from "../Components/Product";
import axios from "axios";
import BreadcrumbNavigation from "../Components/BreadcumNavigation";
import { Success, Failure } from "../Components/Toast";
import { GlobalContext } from "../ContextApi/GlobalVariables";
import ReviewForm from "../Components/Review/ReviewForm";

const ProductPage = () => {
  const { id } = useParams<string>();
  const { customerId, openReviewForm } = useContext(GlobalContext);
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

  const [data, setData] = useState<ProductType[]>();
  const [mainImageUrl, setMainImageUrl] = useState<string>();
  const [color, setColor] = useState<string>();
  const quantityInput = useRef<HTMLInputElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const lockScrollRef = useRef<HTMLDivElement | null>(null);

  const product = data?.find((e) => e._id === id) as ProductType;

  useEffect(() => {
    const productList = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`;
        const response = await axios.get<{ data: ProductType[] }>(url, {
          withCredentials: true,
        });
        // console.log(response.data.data)
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    productList();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (infoRef.current) {
      infoRef.current.scrollTop = 0;
    }
    if (product) {
      setColor(product.colorsAvailable?.[0]?.color);
    }
  }, [id, data]);

  useEffect(() => {
    const matched = product?.colorsAvailable?.find((e) => e.color === color);
    if (matched?.imageList?.[0]) {
      setMainImageUrl(matched.imageList[0]);
    }
  }, [color, product]);

  useEffect(() => {
    const rightDiv = infoRef.current;
    const wrapper = lockScrollRef.current;
    const imageList = document.getElementById("image-scroll-list");

    if (!rightDiv || !wrapper || !imageList) return;

    const handleScroll = (e: WheelEvent) => {
      if (imageList.contains(e.target as Node)) return;

      const scrollDown = e.deltaY > 0;
      const scrollUp = e.deltaY < 0;
      const atBottom =
        rightDiv.scrollTop + rightDiv.clientHeight >= rightDiv.scrollHeight - 1;
      const atTop = rightDiv.scrollTop <= 0;

      const speedMultiplier = 1;

      if ((scrollDown && !atBottom) || (scrollUp && !atTop)) {
        rightDiv.scrollTop += e.deltaY * speedMultiplier;
        e.preventDefault();
      }
    };

    wrapper.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      wrapper.removeEventListener("wheel", handleScroll);
    };
  }, [id]);

  const handleAddToCart = async (val: boolean) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/add-cart-product`;
      const payload = {
        customerId,
        productId: product?._id,
        productName: product?.productName,
        imageLink: product?.colorsAvailable[0]?.imageList[0],
        quantity: quantityInput.current?.value,
        price: product?.price,
        category: product?.category,
      };
      const res = await axios.post(url, payload, { withCredentials: true });
      console.log(res?.data);
      {
        val && Success("Item added to your cart successfully!");
      }
    } catch (error) {
      console.log(error);
      {
        val && Failure("Failed to add the product. Please try again.");
      }
    }
  };

  const handleByeNow = async () => {
    await handleAddToCart(false);
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="mt-[95px] w-[90%] m-auto">
        <BreadcrumbNavigation />

        <div
          className="my-[20px] lg:flex-row flex flex-col gap-5"
          ref={lockScrollRef}
        >
          <div className="gap-3 flex flex-col-reverse xsm:flex-row shrink-0">
            <div
              id="image-scroll-list"
              className="flex flex-row xsm:flex-col gap-2 overflow-x-auto xsm:overflow-y-auto max-w-full xsm:max-h-[400px] pr-2 scrollbar-thin scrollbar-hidden"
            >
              {product?.colorsAvailable
                ?.find((e) => e.color === color)
                ?.imageList.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="h-[70px] w-[70px] flex-shrink-0 border border-gray-200 rounded overflow-hidden"
                    onClick={() => setMainImageUrl(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`image-${index}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>

            <img
              src={mainImageUrl}
              alt="Main product"
              className="rounded-md w-[400px] h-[400px] object-contain"
            />
          </div>

          <div
            ref={infoRef}
            className="xsm:px-11 flex flex-col xsm:overflow-y-scroll h-fit lg:h-[400px] scrollbar-hidden"
          >
            <h1 className="text-3xl font-bold">{product?.productName}</h1>
            <div className="flex mt-2">
              <div className="flex text-2xl items-center text-yellow-400">
                <IoMdStar /> <IoMdStar /> <IoMdStar /> <IoMdStar />
                <IoMdStarOutline className="text-[rgba(0,0,0,0.2)]" />
              </div>
              <p>&ensp; {product?.ratings} out of 5</p>
            </div>

            <div className="text-4xl text-[#2094F3] font-extrabold my-4">
              <span className="font-bold">&#8377;</span>{" "}
              {product?.price.toFixed(2)}
            </div>

            <div>
              <h1 className="text-xl font-semibold my-3">Description</h1>
              <p className="text-[rgba(0,0,0,0.7)]">{product?.description}</p>
            </div>

            <div>
              <h1 className="text-xl font-semibold my-3">Features</h1>
              {product?.features.map((feature, index) => (
                <div key={index} className="flex gap-3 items-center my-1">
                  <FaCheck className="text-green-400" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            {Array.isArray(product?.colorsAvailable) &&
              product.colorsAvailable.length > 1 && (
                <div className="my-5 flex flex-col gap-3">
                  <h1 className="text-xl font-semibold">Colors</h1>
                  <div className="flex overflow-x-scroll scrollbar-hidden gap-3">
                    {product.colorsAvailable.map(
                      ({ color: c, imageList }, index) => (
                        <div
                          className="flex flex-col cursor-pointer w-[60px] "
                          key={index}
                          onClick={() => setColor(c)}
                        >
                          <img
                            src={imageList[0]}
                            alt=""
                            className="w-[50px] h-[50px] object-cover rounded-md p-1 shadow-[0_0_5px_rgba(0,0,0,0.5)] "
                          />
                          <h1 className="text-sm font-semibold text-center">
                            {c}
                          </h1>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {Array.isArray(product?.sizesAvailable) &&
              product.sizesAvailable.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h1 className="text-xl font-semibold">Available Sizes</h1>
                  <div className="flex gap-3 overflow-x-scroll scrollbar-hidden">
                    {product.sizesAvailable.map((e, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-3 py-2 shadow-md border border-1 rounded-md border-[rgba(0,0,0,0.2)] cursor-pointer hover:border-blue-400"
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="gap-5 my-5 flex flex-col xsm:flex-row">
              <div className="[border:1px_solid_rgba(0,0,0,0.2)] flex w-full justify-between xsm:w-fit rounded-md">
                <div
                  className="m-1 p-2 hover:bg-yellow-400 rounded-sm flex items-center"
                  onClick={() => {
                    const input = quantityInput.current;
                    if (input && parseInt(input.value) > 1) {
                      input.value = (parseInt(input.value) - 1).toString();
                    }
                  }}
                >
                  <FaMinus />
                </div>
                <input
                  ref={quantityInput}
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="outline-none w-[50px] text-center transition-transform duration-200 border focus:border-2 rounded-md"
                  onFocus={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onBlur={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    if (
                      !e.currentTarget.value ||
                      parseInt(e.currentTarget.value) < 1
                    ) {
                      e.currentTarget.value = "1";
                    }
                  }}
                />
                <div
                  className="p-2 m-1 hover:bg-yellow-400 rounded-sm flex items-center"
                  onClick={() => {
                    const input = quantityInput.current;
                    if (input) {
                      input.value = (parseInt(input.value) + 1).toString();
                    }
                  }}
                >
                  <FaPlus />
                </div>
              </div>
              <button
                className="px-12 py-2 bg-[#2094F3] w-full xsm:w-fit text-center rounded-md font-semibold text-white text-nowrap flex items-center"
                onClick={() => handleAddToCart(true)}
              >
                Add to Cart
              </button>
              <button
                className="px-12 py-2 bg-yellow-900 w-full xsm:w-fit text-center rounded-md font-semibold text-white text-nowrap flex items-center"
                onClick={handleByeNow}
              >
                Buy Now
              </button>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Product Detail</h1>
              <div className="p-2">{product?.productDetails}</div>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col my-[50px]">
          <h1 className="text-3xl font-bold xsm:text-start text-center">
            Related products
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 my-10 place-items-center">
            {data?.map(
              (
                {
                  productName,
                  _id,
                  ratings,
                  description,
                  price,
                  colorsAvailable,
                  category,
                },
                index
              ) => (
                <Product
                  key={index}
                  productName={productName}
                  id={_id}
                  rating={ratings}
                  description={description}
                  price={price}
                  imageLink={colorsAvailable[0]?.imageList[0]}
                  category={category}
                />
              )
            )}
          </div>
        </div> */}

        <div className="my-10">
          <ReviewSection
            productName={"Premium Wireless Headphones"}
            rating={"4.5"}
            ratingBreakdown={[
              { stars: 5, percentage: 67 },
              { stars: 4, percentage: 33 },
              { stars: 3, percentage: 10 },
              { stars: 2, percentage: 5 },
              { stars: 1, percentage: 3 },
            ]}
          />
        </div>
      </div>

      {/* {openReviewForm && (
        <div className="h-full fixed top-0 left-1/2 -translate-x-1/2 w-full z-20 backdrop-blur-[2px] flex items-center">
          <ReviewForm />
        </div>
      )} */}
      {openReviewForm && (

        <div className="popup fixed inset-0 z-20 backdrop-blur-[2px] flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
          <ReviewForm />
        </div>
      )}
    </>
  );
};

export default ProductPage;

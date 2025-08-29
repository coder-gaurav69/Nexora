import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types
interface ColorImage {
  color: string;
  imageList: string[];
}

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  ratings?: number;
  category: string;
  brandType: string;
  features?: string[];
  productDetails?: string;
  boxContents?: string[];
  colorsAvailable: ColorImage[];
  materialMadeUp?: string;
  sizesAvailable?: string[];
}

// Response shape from backend
interface ProductResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

const List: React.FC = () => {
  const [list, setList] = useState<Product[]>([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  // Fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get<ProductResponse>(`${url}/api/products`,{withCredentials:true});
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching products");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // Delete a product
  const removeFood = async (productId: string) => {
  try {
    const response = await axios.request<ProductResponse>({
      method: 'DELETE',
      url: `${url}/api/deleteProduct`,
      headers: { 'Content-Type': 'application/json' },
      data: { productId } as any,
    });

    const resData = response.data;
    if (resData.success) {
      toast.success(resData.message || "Deleted");
      await fetchList();
    } else {
      toast.error(resData.message || "Failed to delete");
    }
  } catch (err) {
    toast.error("Error deleting product");
    console.error(err);
  }
};


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-6 w-[70%] mx-auto text-gray-800">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">All Product List</h2>

      <div className="grid gap-6">
        {list.map((item) => (
          <div key={item._id} className="border rounded-xl p-4 shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="min-w-[120px] max-w-[160px]">
                <img
                  src={item.colorsAvailable?.[0]?.imageList?.[0] || ""}
                  alt={item.productName}
                  className="rounded-md object-cover w-full h-auto"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{item.productName}</h3>
                  <button
                    onClick={() => removeFood(item._id)}
                    className="text-red-500 font-bold text-lg hover:text-red-700"
                  >
                    X
                  </button>
                </div>

                <p className="text-sm text-gray-600">{item.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Brand:</strong> {item.brandType}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  <p><strong>Ratings:</strong> {item.ratings || 0}/5</p>
                  {item.materialMadeUp && (
                    <p><strong>Material:</strong> {item.materialMadeUp}</p>
                  )}
                </div>

                {/* Features */}
                {!!item.features?.length && (
                  <div>
                    <p className="font-medium">Features:</p>
                    <ul className="list-disc list-inside text-sm">
                      {item.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Box Contents */}
                {!!item.boxContents?.length && (
                  <div>
                    <p className="font-medium">Box Contents:</p>
                    <ul className="list-disc list-inside text-sm">
                      {item.boxContents.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sizes */}
                {!!item.sizesAvailable?.length && (
                  <p className="text-sm">
                    <strong>Sizes:</strong> {item.sizesAvailable.join(", ")}
                  </p>
                )}

                {/* Colors & Images */}
                {item.colorsAvailable?.length > 0 && (
                  <div>
                    <p className="font-medium mt-2">Colors & Images:</p>
                    <div className="flex flex-wrap gap-4 mt-1">
                      {item.colorsAvailable.map((colorItem, idx) => (
                        <div key={idx} className="border rounded-md p-2">
                          <p className="text-sm font-medium mb-1">
                            {colorItem.color}
                          </p>
                          <div className="flex gap-2">
                            {colorItem.imageList.map((img, imgIdx) => (
                              <div key={imgIdx} className="border">
                                <img
                                  src={img}
                                  alt={colorItem.color}
                                  className="w-14 h-14 object-cover rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;

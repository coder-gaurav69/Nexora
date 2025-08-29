import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ColorImage {
  color: string;
  images: File[];
}

interface ProductData {
  productName: string;
  description: string;
  price: string;
  category: string;
  brandType: string;
  productDetails: string;
  materialMadeUp: string;
}

const Add: React.FC = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [colorsAvailable, setColorsAvailable] = useState<ColorImage[]>([
    { color: "", images: [] },
  ]);

  const [data, setData] = useState<ProductData>({
    productName: "",
    description: "",
    price: "",
    category: "",
    brandType: "",
    productDetails: "",
    materialMadeUp: "",
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [boxContents, setBoxContents] = useState<string[]>([]);
  const [sizesAvailable, setSizesAvailable] = useState<string[]>([]);

  const [featureInput, setFeatureInput] = useState<string>("");
  const [boxInput, setBoxInput] = useState<string>("");
  const [sizeInput, setSizeInput] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const addToArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputValue: string,
    resetSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (inputValue.trim()) {
      setter((prev) => [...prev, inputValue.trim()]);
      resetSetter("");
    }
  };

  const removeFromArray = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (
    index: number,
    field: "color" | "images",
    value: string | File[]
  ) => {
    const updatedColors = [...colorsAvailable];
    if (field === "images") {
      updatedColors[index].images = value as File[];
    } else {
      updatedColors[index].color = value as string;
    }
    setColorsAvailable(updatedColors);
  };

  const addColorBlock = () => {
    setColorsAvailable((prev) => [...prev, { color: "", images: [] }]);
  };

  const removeColorBlock = (index: number) => {
    const updated = [...colorsAvailable];
    updated.splice(index, 1);
    setColorsAvailable(updated);
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    features.forEach((value) => formData.append("features", value));
    boxContents.forEach((value) => formData.append("boxContents", value));
    sizesAvailable.forEach((value) => formData.append("sizesAvailable", value));

    colorsAvailable.forEach(({ color, images }) => {
      formData.append("colorNames", color);
      images.forEach((file) => {
        formData.append(color, file);
      });
    });

    try {
      await axios.post(`${url}/api/add-product`, formData,{withCredentials:true});
      toast.success("Product added successfully");
      setData({
        productName: "",
        description: "",
        price: "",
        category: "",
        brandType: "",
        productDetails: "",
        materialMadeUp: "",
      });
      setFeatures([]);
      setBoxContents([]);
      setSizesAvailable([]);
      setColorsAvailable([{ color: "", images: [] }]);
      setFeatureInput("");
      setBoxInput("");
      setSizeInput("");
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div className="w-[70%] ml-[max(5vw,25px)] my-[50px] text-[#6d6d6d] text-[16px]">
      <ToastContainer />
      <form className="flex flex-col gap-5" onSubmit={onSubmitHandler}>
        <input
          name="productName"
          value={data.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="p-3 w-[max(40%,280px)] border rounded"
        />
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          rows={4}
          placeholder="Description"
          required
          className="p-3 w-[max(40%,280px)] border rounded"
        />
        <input
          name="price"
          value={data.price}
          onChange={handleChange}
          type="number"
          placeholder="Price ₹"
          required
          className="p-3 max-w-[200px] border rounded"
        />
        <input
          name="category"
          value={data.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-3 max-w-[200px] border rounded"
        />
        <input
          name="brandType"
          value={data.brandType}
          onChange={handleChange}
          placeholder="Brand Type"
          className="p-3 max-w-[200px] border rounded"
        />
        <input
          name="productDetails"
          value={data.productDetails}
          onChange={handleChange}
          placeholder="Product Details"
          className="p-3 border rounded"
        />
        <input
          name="materialMadeUp"
          value={data.materialMadeUp}
          onChange={handleChange}
          placeholder="Material Made Up"
          className="p-3 border rounded"
        />

        {/* Feature Field */}
        <div className="flex gap-3 mb-3">
          <input
            placeholder="Add Feature"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            className="p-3 border rounded"
          />
          <button
            type="button"
            onClick={() =>
              addToArray(setFeatures, featureInput, setFeatureInput)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add
          </button>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFromArray(i, setFeatures)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Box Content Field */}
        <div className="flex gap-3 mb-3">
          <input
            placeholder="Add Box Content"
            value={boxInput}
            onChange={(e) => setBoxInput(e.target.value)}
            className="p-3 border rounded"
          />
          <button
            type="button"
            onClick={() => addToArray(setBoxContents, boxInput, setBoxInput)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add
          </button>
        </div>
        {boxContents.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {boxContents.map((box, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {box}
                <button
                  type="button"
                  onClick={() => removeFromArray(i, setBoxContents)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Size Field */}
        <div className="flex gap-3 mb-3">
          <input
            placeholder="Add Size"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            className="p-3 border rounded"
          />
          <button
            type="button"
            onClick={() =>
              addToArray(setSizesAvailable, sizeInput, setSizeInput)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add
          </button>
        </div>
        {sizesAvailable.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizesAvailable.map((size, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeFromArray(i, setSizesAvailable)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        )}

        <hr className="my-4" />
        <h4 className="font-semibold">Add Product Colors</h4>
        {colorsAvailable.map((colorItem, index) => (
          <div key={index} className="border p-4 mb-4">
            <input
              type="text"
              placeholder="Color Name"
              value={colorItem.color}
              onChange={(e) =>
                handleColorChange(index, "color", e.target.value)
              }
              required
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="file"
              multiple
              onChange={(e) =>
                handleColorChange(
                  index,
                  "images",
                  Array.from(e.target.files ?? [])
                )
              }
              className="mb-2"
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {colorItem.images.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-[60px] h-[60px] object-cover rounded"
                />
              ))}
            </div>
            {colorsAvailable.length > 1 && (
              <button
                type="button"
                onClick={() => removeColorBlock(index)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addColorBlock}
          className="mb-5 px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Another Color
        </button>

        <button
          type="submit"
          className="max-w-[120px] px-4 py-2 bg-black text-white rounded cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;

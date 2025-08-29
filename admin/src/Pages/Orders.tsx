import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface DeliveryAddress {
  street: string;
  optional?: string;
  city: string;
  state: string;
  zip: string;
  instruction?: string;
}

interface PaymentInfo {
  method: "COD" | "Online";
  status: "Pending" | "Completed" | "Failed";
  transactionId?: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageLink?: string;
}

interface Order {
  _id: string;
  customerId: string;
  recipientType: "Myself" | "Other";
  shippingInfo: ShippingInfo;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  paymentInfo: PaymentInfo;
  orderStatus:
    | "Placed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Pending";
  deliveredAt?: string;
  orderedAt: string;
}


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const url = import.meta.env.VITE_BACKEND_URL;
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/getOrderDetails`,{withCredentials:true}) as any;
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const statusHandler = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    try {
      const response = await axios.patch(`${url}/api/updateOrderStatus`, {
        orderId,
        status: event.target.value,
      }) as any;
      if (response.data.success) {
        toast.success("Status updated");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="w-[70%] mx-auto p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-red-300 rounded-xl p-4 shadow-md grid gap-6 md:grid-cols-7 grid-cols-1"
          >
            <div>
              <img
                src={assets.parcel_icon}
                alt="Parcel"
                className="w-14 h-14 mb-2"
              />
              <p className="text-sm font-medium">Items: {order.items.length}</p>
              <p className="text-sm font-medium text-green-700">
                ₹
                {order.items
                  .reduce(
                    (acc, item) => acc + item.quantity * item.price,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>

            <div className="col-span-2 space-y-2">
              <p className="font-semibold">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p className="text-sm text-gray-700">
                {order.shippingInfo.phoneNumber}
              </p>
              <p className="text-sm text-gray-700">
                {order.shippingInfo.email}
              </p>

              <div className="text-sm text-gray-600">
                <p>{order.deliveryAddress.street}</p>
                {order.deliveryAddress.optional && (
                  <p>{order.deliveryAddress.optional}</p>
                )}
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state},{" "}
                  {order.deliveryAddress.zip}
                </p>
                {order.deliveryAddress.instruction && (
                  <p>{order.deliveryAddress.instruction}</p>
                )}
              </div>
            </div>

            <div className="col-span-2 space-y-2 text-sm">
              <p className="font-medium">
                Payment Mode: {order.paymentInfo.method}
              </p>
              <p className="font-medium">
                Payment Status: {order.paymentInfo.status}
              </p>
              <p>Order Status: {order.orderStatus}</p>
            </div>

            <div className="col-span-1 space-y-2">
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.orderStatus}
                className="bg-red-50 border border-red-300 rounded-md px-3 py-2 w-full text-sm outline-none"
              >
                <option value="Placed">Placed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
              </select>

              <div className="text-xs text-gray-600">
                <p>
                  Ordered At:{" "}
                  {new Date(order.orderedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                {order.deliveredAt && (
                  <p>
                    Delivered At:{" "}
                    {new Date(order.deliveredAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-full md:col-span-5 text-sm pt-4 border-t">
              <p className="font-semibold mb-1">Products:</p>
              <ul className="list-disc list-inside">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.productName} × {item.quantity} – ₹{item.price} each
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

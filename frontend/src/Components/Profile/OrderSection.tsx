import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaTruck } from "react-icons/fa";
import { GlobalContext } from "../../ContextApi/GlobalVariables";

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageLink?: string;
};

type Order = {
  _id: string;
  customerId: string;
  recipientType: "Myself" | "Other";
  shippingInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  deliveryAddress: {
    street: string;
    optional?: string;
    city: string;
    state: string;
    zip: string;
    instruction?: string;
  };
  items: OrderItem[];
  paymentInfo: {
    method: "COD" | "Online";
    status: "Pending" | "Completed" | "Failed";
    transactionId?: string;
  };
  orderStatus: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Pending";
  deliveredAt?: Date;
  orderedAt: Date;
};

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
  Pending: "bg-gray-100 text-gray-800",
  Placed: "bg-gray-200 text-gray-800",
};

export default function OrderSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { customerId } = useContext(GlobalContext);

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/getOrderDetails?customerId=${customerId}`;
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        const sortedOrders = ((res.data as any).data || []).sort(
          (a: Order, b: Order) =>
            new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
        );
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex-1">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Order History</h1>
        <p className="text-gray-500 mb-6">Track and manage your past purchases.</p>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                {/* Top Row: Order Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h2>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          statusStyles[order.orderStatus] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Ordered on {new Date(order.orderedAt).toLocaleDateString()} •{" "}
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      item
                      {order.items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 ml-auto">
                    <p className="text-lg font-semibold">
                      $
                      {order.items
                        .reduce((sum, item) => sum + item.price * item.quantity, 0)
                        .toFixed(2)}
                    </p>
                    <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
                      <FaTruck />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>

                {/* Product List */}
                <div className="mt-4 border-t pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 text-sm text-gray-700"
                    >
                      {item.imageLink ? (
                        <img
                          src={item.imageLink}
                          alt={item.productName}
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery + Payment Info */}
                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                    <p>
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                      {order.deliveryAddress.zip}
                    </p>
                    {order.deliveryAddress.instruction && (
                      <p className="text-gray-500 italic">
                        Note: {order.deliveryAddress.instruction}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Payment</h3>
                    <p>Method: {order.paymentInfo.method}</p>
                    <p>Status: {order.paymentInfo.status}</p>
                    {order.paymentInfo.transactionId && (
                      <p>Txn ID: {order.paymentInfo.transactionId}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { FaTruck } from "react-icons/fa";

const orders = [
  {
    id: "NX-2024-001",
    status: "Delivered",
    date: "Jan 15, 2024",
    items: 3,
    total: 299.99,
  },
  {
    id: "NX-2024-002",
    status: "In Transit",
    date: "Jan 10, 2024",
    items: 2,
    total: 149.5,
  },
  {
    id: "NX-2024-003",
    status: "Delivered",
    date: "Dec 28, 2023",
    items: 1,
    total: 89.99,
  },
];

const statusStyles= {
  Delivered: "bg-black text-white",
  "In Transit": "bg-gray-100 text-gray-800",
} as any;

export default function OrderSection() {
  return (
    <div className="bg-white min-h-screen p-6 w-fit flex-1">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Order History</h1>
        <p className="text-gray-500 mb-6">Track and manage your orders.</p>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    Order {order.id}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {order.date} • {order.items} item{order.items > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-2 ml-auto">
                <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
                  <FaTruck />
                  <span>Track Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";
import { Success } from "../Toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "order" | "offer" | "alert";
  date: string;
  isRead: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "Order Shipped 🚚",
    message: "Your order #123456 has been shipped and will arrive soon.",
    type: "order",
    date: "2025-07-27",
    isRead: false,
  },
  {
    id: 2,
    title: "50% Off on Electronics! ⚡",
    message: "Limited time offer! Grab your favorite gadgets now.",
    type: "offer",
    date: "2025-07-26",
    isRead: false,
  },
  {
    id: 3,
    title: "Payment Successful 💳",
    message: "Your payment for order #123456 has been received.",
    type: "alert",
    date: "2025-07-25",
    isRead: true,
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(defaultNotifications);
    }
  }, []);

  // Save to localStorage on any change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    Success("All notifications marked as read");
  };

  const markAsRead = (id: number) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
  };

  const deleteNotification = (id: number) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    Success("Notification deleted");
  };

  const deleteAll = () => {
    setNotifications([]);
    Success("All notifications deleted");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="p-6 bg-gray-50 min-h-screen flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications{" "}
            <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          </h1>
          <p className="text-gray-500">Stay updated with your latest activity</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-sm bg-black text-white px-4 py-2 rounded-md"
          >
            Mark all as read
          </button>
          <button
            onClick={deleteAll}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete All
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FiBell className="text-5xl mx-auto mb-4" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start justify-between p-4 rounded-md shadow bg-white border-l-4 ${
                notif.type === "order"
                  ? "border-blue-500"
                  : notif.type === "offer"
                  ? "border-green-500"
                  : "border-yellow-500"
              }`}
            >
              <div>
                <h3
                  className={`font-semibold text-md ${
                    notif.isRead ? "text-gray-500" : "text-black"
                  }`}
                >
                  {notif.title}
                </h3>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <button
                onClick={() => deleteNotification(notif.id)}
                className="text-gray-400 hover:text-red-500 mt-1"
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Notification;

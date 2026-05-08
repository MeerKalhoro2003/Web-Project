import React, { useEffect, useState } from "react";
import api from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.data.notifications);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, readStatus: true } : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-lg border ${notif.readStatus ? "bg-slate-50 border-slate-200" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{notif.title}</h3>
                  <p className="text-slate-600 mt-1">{notif.message}</p>
                </div>
                {!notif.readStatus && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

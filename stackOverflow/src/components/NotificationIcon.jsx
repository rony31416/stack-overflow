import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const NotificationIcon = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/notifications/${userId}`
        );
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);

        const unread = response.data.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Add event listener for outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/notifications/${notificationId}/mark`
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none relative"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Updated path for a bell icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11c0-3.315-2.685-6-6-6s-6 2.685-6 6v3c0 .418-.262.787-.647.922L4 17h5m5 0v1a3 3 0 01-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs font-bold px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-bold">Notifications</span>
            <button
              onClick={() => setShowDropdown(false)}
              className="text-gray-500"
            >
              x
            </button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  !notification.isRead ? "font-semibold" : ""
                }`}
                onClick={() => markAsRead(notification._id)}
              >
                {notification.message}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

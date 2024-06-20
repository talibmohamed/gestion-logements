import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon";
import { selectNotifications } from "../../../../session/notificationSlice";

export default function App() {
  const notifications = useSelector(selectNotifications);

  // Function to calculate time since notification
  const formatTimeSince = (dateString) => {
    const notificationDate = new Date(dateString);
    const now = new Date();
    const diffMilliseconds = now - notificationDate;
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
      return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      // Format the date as 'DD/MM/YYYY' if more than 24 hours ago
      const day = notificationDate.getDate();
      const month = notificationDate.getMonth() + 1;
      const year = notificationDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };

  // Sort notifications by date, newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.notif_date) - new Date(a.notif_date)
  );

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  const markNotificationAsRead = (notifId) => {};

  return (
    <Dropdown
      showArrow
      radius="l"
      classNames={{
        base: "before:bg-[#171821]",
        content: "py-1 border-small border-divider bg-[#21222d]",
      }}
    >

      <DropdownTrigger>
        <button className="flex items-center justify-center p-2 rounded-full bg-transparent border-none outline-none">
          <Badge content={unreadCount} shape="circle" size="md" color="danger" variant="shadow">
            <NotificationIcon size={24} />
          </Badge>
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifications"
        closeOnSelect={false}
        classNames={{
          base: "bg-[#21222d] shadow-lg rounded-lg my-4 w-80",
          content: "p-0 overflow-y-auto max-h-80",
        }}
      >
        {sortedNotifications.map((notification) => (
          <DropdownItem
            key={notification.notif_id}
            onClick={() => markNotificationAsRead(notification.notif_id)}
            className={`${
              notification.is_read ? "text-gray-400" : "text-white"
            } hover:bg-[#171821] cursor-pointer`}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">
                  {notification.notif_titre}
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeSince(notification.notif_date)}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {notification.notif_desc}
              </div>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

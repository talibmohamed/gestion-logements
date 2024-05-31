import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useSelector } from "react-redux"; // Import useSelector hook to access Redux state
// import { notification } from "../../../../session/services/api"; // Import fetchData function
import { NotificationIcon } from "./NotificationIcon";

export default function App() {
  // State to store notifications
  const [notifications, setNotifications] = useState([]);

  // Redux selector to get JWT token from the store
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  // Function to fetch notifications
  const notification = async () => {
    try {
      // Fetch notifications data using JWT token
      const notificationData = await fetchData("notifications", jwtToken); // Adjust the endpoint according to your API route
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    notification();
  }, []);

  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200", // change arrow background
        content: "p-0 border-small border-divider bg-background",
      }}
    >
      <DropdownTrigger>
        <Button radius="full" isIconOnly variant="none">
          <NotificationIcon size={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={["profile"]}
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Notifications" showDivider>
          {notifications.map((notification) => (
            <DropdownItem key={notification.notif_id}>
              {notification.notif_titre}
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout">Log Out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

"use client";
import { Bell, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(public)/login/actions";
import { useState } from "react";
import Notifications from "../Notifications/Notifications";
import { useNotificationCount } from "../Notifications/NotificationContext";
import { NotificationProvider } from "../Notifications/NotificationContext";

const NOTIFICATIONS_COUNT_LIMIT = 10;

export default function TopbarWrapper() {
  return (
    <NotificationProvider>
      <Topbar />
    </NotificationProvider>
  );
}

function Topbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalNotifications } = useNotificationCount();

  const pageTitle = pathname.split("/").filter(Boolean).pop() || "Payments";

  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{formattedTitle}</h1>

      <div className="flex items-center space-x-4">
        <button
          className="relative p-2 hover:bg-gray-200 rounded"
          onClick={() => setIsOpen(true)}
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {totalNotifications > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold 
            rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]"
            >
              {totalNotifications > NOTIFICATIONS_COUNT_LIMIT
                ? `${NOTIFICATIONS_COUNT_LIMIT}+`
                : totalNotifications}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          name="logout"
          className="p-2 hover:bg-red-100 rounded"
          title="Logout"
        >
          <LogOut className="w-6 h-6 text-red-600" />
        </button>

        {isOpen ? <Notifications setIsOpen={setIsOpen} /> : null}
      </div>
    </header>
  );
}

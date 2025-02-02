import { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";

interface NotificationContextType {
  totalNotifications: number;
  setTotalNotifications: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const { data } = useNotifications();

  useEffect(() => {
    if (data?.pages?.[0]?.meta?.totalRowCount) {
      setTotalNotifications(data.pages[0].meta.totalRowCount);
    }
  }, [data]);

  return (
    <NotificationContext.Provider
      value={{ totalNotifications, setTotalNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCount() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationCount must be used within a NotificationProvider"
    );
  }
  return context;
}

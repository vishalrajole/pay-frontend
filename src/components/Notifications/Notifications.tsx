import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { useNotifications } from "./useNotifications";
import { Error } from "../Error/Error";
import { Spinner } from "../Spinner/Spinner";

interface NotificationsProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Notifications({ setIsOpen }: NotificationsProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  } = useNotifications();

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  useEffect(() => {
    if (!notificationRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    const currentRef = notificationRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage]);

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />

      <aside className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-lg z-50 p-4 flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2">
          {isLoading ? <Spinner /> : null}
          {flatData.map((notification) => (
            <div
              key={notification.id}
              className="p-2 border rounded-lg bg-gray-100"
            >
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm font-medium">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-gray-500">{notification.message}</p>
            </div>
          ))}

          <div ref={notificationRef} className="py-4 flex justify-center">
            {isFetchingNextPage && <Spinner />}
          </div>
        </div>
      </aside>
    </>
  );
}

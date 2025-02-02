import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { NotificationResponse } from "@/@types/notifications";
import { QUERIES } from "@/helpers/queries";
import { API_URL, STALE_TIME } from "@/helpers/api";

export const DEFAULT_PAGE_LIMIT = 50;

async function getNotifications({
  start,
  limit,
}: {
  start: number;
  limit: number;
}) {
  const params = new URLSearchParams({
    start: start.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}notifications?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching payments");
  }

  const data = await response.json();

  return data;
}

export const useNotifications = () => {
  return useInfiniteQuery<NotificationResponse>({
    queryKey: [QUERIES.notifications.fetchNotifications],

    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * DEFAULT_PAGE_LIMIT;
      const fetchedData = await getNotifications({
        start: start,
        limit: DEFAULT_PAGE_LIMIT,
      });
      return fetchedData;
    },
    staleTime: STALE_TIME,
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

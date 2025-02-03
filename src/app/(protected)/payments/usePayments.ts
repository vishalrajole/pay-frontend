import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { PaymentResponse } from "@/@types/payments";
import { QUERIES } from "@/helpers/queries";
import { API_URL } from "@/helpers/api";

export const DEFAULT_PAGE_LIMIT = 50;

async function getPayments({
  start,
  limit,
  sorting,
  searchTerm,
}: {
  start: number;
  limit: number;
  sorting: SortingState;
  searchTerm?: string;
}) {
  const params = new URLSearchParams({
    start: start.toString(),
    limit: limit.toString(),
    sorting: JSON.stringify(sorting),
    searchTerm: searchTerm || "",
  });

  const response = await fetch(`${API_URL}/payments?${params.toString()}`);

  return response.json();
}

export const usePayments = ({
  sorting,
  searchTerm,
}: {
  sorting: SortingState;
  searchTerm?: string;
}) => {
  return useInfiniteQuery<PaymentResponse>({
    queryKey: [QUERIES.payments.fetchPayments, [sorting, searchTerm]],

    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * DEFAULT_PAGE_LIMIT;
      const fetchedData = await getPayments({
        start: start,
        limit: DEFAULT_PAGE_LIMIT,
        sorting,
        searchTerm,
      });
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

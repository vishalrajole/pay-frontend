"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/Spinner/Spinner";
import { Error } from "@/components/Error/Error";
import { Grid } from "./Grid";
import { usePayments } from "./usePayments";
import { Search } from "./Search";
import { COLUMNS } from "./Columns";

export function PaymentList() {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const { data, isError, fetchNextPage, isFetching, isLoading } = usePayments({
    sorting,
    searchTerm: debouncedSearchTerm,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const table = useReactTable({
    data: flatData,
    columns: COLUMNS,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
    manualFiltering: true,
    debugTable: true,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Badge variant="outline" className="mr-2 p-2">
          <p className="text-sm font-semibold">
            {totalFetched} of {totalDBRowCount} Payments
          </p>
        </Badge>
      </div>

      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
        className="container overflow-auto relative h-[600px]"
      >
        <Grid
          table={table}
          rowVirtualizer={rowVirtualizer}
          COLUMNS={COLUMNS}
          rows={rows}
        />
      </div>
    </div>
  );
}

"use client";

import { ColumnDef, flexRender, Row } from "@tanstack/react-table";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table as TableType } from "@tanstack/react-table";
import { Payment } from "@/api/makeData";
import { Virtualizer } from "@tanstack/react-virtual";

type DataTableProps = {
  table: TableType<Payment>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  rows: Row<Payment>[];
  COLUMNS: ColumnDef<Payment>[];
};

export function Grid({ table, rowVirtualizer, rows, COLUMNS }: DataTableProps) {
  return (
    <TableComponent className="relative border border-gray-200 ">
      <TableHeader className="sticky top-0 z-10 bg-gray-800 ">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="flex w-full">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="flex px-3 py-2 border-r border-gray-700"
                style={{ width: header.getSize() }}
              >
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? "cursor-pointer select-none text-white font-bold"
                      : "",
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rows.length > 0 ? (
          rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<Payment>;

            return (
              <TableRow
                key={row.id}
                ref={(node) => rowVirtualizer.measureElement(node)}
                data-index={virtualRow.index}
                className="flex absolute w-full hover:bg-gray-100"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="flex px-3 py-2 border-r border-gray-100"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} className="h-24 text-center">
              No payments.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableComponent>
  );
}

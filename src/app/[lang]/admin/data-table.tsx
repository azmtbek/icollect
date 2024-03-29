"use client";
import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import { DataTableViewOptions } from "@/components/custom/data-table-column-toggle";
import { Trash2 } from "lucide-react";
import { LockClosedIcon, LockOpen1Icon, LockOpen2Icon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

export function DataTable<TData extends { id: string; }, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  // const ;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center py-4 gap-4 ">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            // const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            // setPending(true);
            // blockUsers(selectedUserIds).then(() => {
            //   router.refresh();
            //   table.toggleAllPageRowsSelected(false);
            //   setPending(false);
            // });
            // console.log(selectedUserIds);
          }}
          variant={'outline'}
        // disabled={pending}
        >
          <LockClosedIcon />
          <span className="px-1"></span>
          Block
        </Button>
        <Button
          onClick={() => {
            // const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            // setPending(true);
            // unblockUsers(selectedUserIds).then(() => {
            //   router.refresh();
            //   table.toggleAllPageRowsSelected(false);
            //   setPending(false);
            // });
          }}
          // disabled={pending}
          variant={'outline'}>
          <LockOpen1Icon />
          Unblock
        </Button>
        <Button
          onClick={() => {
            // setPending(true);
            const selectedIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            console.log(selectedIds);
            // const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            // deleteUsers(selectedUserIds).then(() => {
            //   router.refresh();
            //   table.toggleAllPageRowsSelected(false);
            //   setPending(false);
            // });

          }}
          disabled={!table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          variant={'destructive'}>
          <Trash2 />
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (isLoading ? (table.getHeaderGroups().map((headerGroup) => (<>
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} className="">
                    <Skeleton className="w-full h-8 px-2" />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} className="">
                    <Skeleton className="w-full h-8 px-2" />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} className="">
                    <Skeleton className="w-full h-8 px-2" />
                  </TableCell>
                ))}
              </TableRow>
            </>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div >
  );
}

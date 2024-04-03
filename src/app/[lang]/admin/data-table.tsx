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
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  refetch: () => Promise<unknown>;
}

export function DataTable<TData extends { id: string; }, TValue>({
  columns,
  data,
  isLoading,
  refetch,
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
  const blockUsers = api.user.blockManyUsers.useMutation({
    async onSuccess() {
      await refetch();
    }
  });
  const unblockUsers = api.user.unblockManyUsers.useMutation({
    async onSuccess() {
      await refetch();
    }
  });
  const deleteUsers = api.user.deleteManyUsers.useMutation({
    async onSuccess() {
      await refetch();
    }
  });
  const addUsersToAdmin = api.user.addManyUsersToAdmin.useMutation({
    async onSuccess() {
      await refetch();
    }
  });
  const removeUsersFromAdmin = api.user.removeManyUsersFromAdmin.useMutation({
    async onSuccess() {
      await refetch();
    }
  });
  const someSelected = table.getIsSomePageRowsSelected();
  const allSelected = table.getIsAllPageRowsSelected();
  const isNotSelected = React.useMemo(() =>
    !someSelected && !allSelected,
    [someSelected, allSelected]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center py-4 gap-4 flex-wrap ">
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
            const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            if (selectedUserIds.length > 0)
              blockUsers.mutate({ userIds: selectedUserIds });
          }}
          variant={'outline'}
          disabled={isNotSelected}
        >
          <LockClosedIcon />
          <span className="px-1"></span>
          Block
        </Button>
        <Button
          onClick={() => {
            const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            if (selectedUserIds.length > 0)
              unblockUsers.mutate({ userIds: selectedUserIds });
          }}
          disabled={isNotSelected}
          variant={'outline'}>
          <LockOpen1Icon />
          Unblock
        </Button>
        <Button
          onClick={() => {
            const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            if (selectedUserIds.length > 0)
              addUsersToAdmin.mutate({ userIds: selectedUserIds });
          }}
          disabled={isNotSelected}
          variant={'outline'}>
          <ShieldCheck />
          Add to Admin
        </Button>
        <Button
          onClick={() => {
            const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            if (selectedUserIds.length > 0)
              removeUsersFromAdmin.mutate({ userIds: selectedUserIds });
          }}
          disabled={isNotSelected}
          variant={'secondary'}>
          <ShieldOff />
          Remove from Admin
        </Button>
        <Button
          onClick={() => {
            const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
            if (selectedUserIds.length > 0)
              deleteUsers.mutate({ userIds: selectedUserIds });
          }}
          disabled={isNotSelected}
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

"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div>
      <Button
        onClick={() => {
          // setPending(true);
          const selectedIds = table.getFilteredSelectedRowModel().rows.map(r => r.original);
          // const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
          // deleteUsers(selectedUserIds).then(() => {
          //   router.refresh();
          //   table.toggleAllPageRowsSelected(false);
          //   setPending(false);
          // });

        }}
        disabled={false}
        variant={'destructive'}>
        <Trash2 />
      </Button>
    </div>
  );
}

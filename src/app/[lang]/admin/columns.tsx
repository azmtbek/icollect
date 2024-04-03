"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/custom/data-tabe-column-header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Locale } from "@/i18n-config";
import { useMemo } from "react";
import { type User } from "@/lib/types/user";

export const useColumns = () => {
  const { lang } = useParams<{ lang: Locale; collectionId: string; }>();

  const columns = useMemo(() => {
    const columns: ColumnDef<User>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={"Name"} />;
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={"Email"} />;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={"Created At"} />;
        },
        cell: ({ row }) => {
          const date = new Intl.DateTimeFormat("en-US", {
            dateStyle: 'long',
            timeStyle: 'short',
          }).format(row.original.createdAt);
          return <div>{date}</div>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={"Status"} />;
        },
      },
      {
        accessorKey: "isAdmin",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={"Admin"} />;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Links</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link
                      href={`/${lang}/collection?user=${user.id}`}
                      className="w-full h-full underline-offset-4 hover:underline">
                      Go to User Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  {user.isAdmin ?
                    <DropdownMenuItem>Remove from Admin</DropdownMenuItem> :
                    <DropdownMenuItem>Add to Admin</DropdownMenuItem>
                  }
                  <DropdownMenuItem className="bg-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
    return columns;
  }, [lang]);

  return columns;
};

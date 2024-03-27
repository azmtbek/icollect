"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
import { Collection } from "@/lib/types/collection";
import { api } from "@/trpc/react";
import { useLocale } from "@/components/provider/locale-provider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";


export const columns: ColumnDef<Collection>[] = [
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
    header: "Name",
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      const locale = useLocale(state => state.collection);
      return <DataTableColumnHeader column={column} title={locale.description} />;
    },
  },
  {
    accessorKey: "topicId",
    header: "Topic",
    cell: ({ row }) => {
      const { data: topic } = api.topic.getTopicById.useQuery({ id: row.original.topicId });
      return topic?.name;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const collection = row.original;
      const { lang } = useParams<{ lang: Locale; }>();
      const router = useRouter();
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
                <Link href={`/${lang}/collection/${collection?.id}/`} className="w-full h-full underline-offset-4 hover:underline">
                  Go to Collection
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="bg-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

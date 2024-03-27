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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
//   text: string;
// };

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
      // return (
      //   <Button
      //     variant="ghost"
      //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //   >
      //     Email
      //     <ArrowUpDown className="ml-2 h-4 w-4" />
      //   </Button>
      // );
      const locale = useLocale(state => state.collection);

      return < DataTableColumnHeader column={column} title={locale.description} />;
    },
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },
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

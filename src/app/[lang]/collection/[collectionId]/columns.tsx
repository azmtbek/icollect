"use client";

import { Column, ColumnDef, Row } from "@tanstack/react-table";
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
import { Collection, CollectionCustomFieldKeys, CollectionCustomFields } from "@/lib/types/collection";
import { api } from "@/trpc/react";
import { useLocale } from "@/components/provider/locale-provider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { Item } from "@/lib/types/item";
import { useMemo } from "react";
import { collectionToItem } from "@/lib/collection-item-mapper";


export const useColumns = () => {
  const { collectionId } = useParams<{ collectionId: string; }>();
  const { data: collection, isLoading: collectionIsLoading } = api.collection.getById.useQuery({ id: +collectionId });
  const locale = useLocale(state => state.collection.view);
  const columns = useMemo(() => {

    const columns: ColumnDef<Item>[] = [
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
        accessorKey: "tags",
        header: "Tag",
        cell: ({ row }) => {
          return 'Tags';
        }
      },
      ...(collectionToItem(collection)
        .map(key => key + "Name" as CollectionCustomFieldKeys)
        .map((key) => ({
          id: collection?.[key] as string,
          accessorKey: key.replace("Name", ""),
          header: ({ column }: { column: any; }) =>
            <DataTableColumnHeader column={column} title={collection?.[key] as string} />,
          cell: ({ row }: { row: Row<Item>; }) => {
            let itm: any = row.getValue(collection?.[key] as string);
            if (!itm) return <>{itm}</>;
            if (itm instanceof Date)
              itm = new Intl.DateTimeFormat("en-US").format(itm);
            return <div>{itm}</div>;
          },
        }))),
      {
        id: "actions",
        cell: ({ row }) => {
          const item = row.original;
          const { lang } = useParams<{ lang: Locale; }>();
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
                    <Link href={`/${lang}/collection/${collectionId}/item/${item.id}`}
                      className="w-full h-full underline-offset-4 hover:underline">
                      {locale.goToItem}
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
    return columns;
  }, [collection]);

  return columns;
};

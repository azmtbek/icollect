"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { type Collection } from "@/lib/types/collection";
import { useLocale } from "@/components/provider/locale-provider";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Locale } from "@/i18n-config";
import { useMemo } from "react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export const useColumns = ({ refetch }: {
  refetch: () => Promise<unknown>;
}) => {
  const { lang } = useParams<{ lang: Locale; collectionId: string; }>();
  const locale = useLocale(state => state.collection);
  // const { data: collections } = api.collection.getUserCollections.useQuery();

  const { data: topic } = api.topic.getAll.useQuery();
  const deleteCollection = api.collection.delete.useMutation({
    async onSuccess() {
      await refetch();
      toast({ title: "Successfully deleted:)" });
    }
  });

  const columns = useMemo(() => {
    const columns: ColumnDef<Collection>[] = [
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
          return <DataTableColumnHeader column={column} title={locale.description} />;
        },
      },
      {
        accessorKey: "topicId",
        header: "Topic",
        cell: ({ row }) => {
          const id = row.original.topicId;
          return topic?.find(t => t.id === id)?.name;
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const collection = row.original;
          return (<>
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
                      href={`/${lang}/collection/${collection?.id}/`}
                      className="w-full h-full underline-offset-4 hover:underline">
                      Go to Collection
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuItem className="cursor-pointer">
                    <Link href={`/${lang}/collection/${collection.id}/edit`}
                      className="w-full h-full">
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild className=" cursor-pointer">
                      <DropdownMenuItem className="bg-destructive" onSelect={(e) => e.preventDefault()}>
                        <span>
                          Delete
                        </span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                          Just kidding:)
                          <DialogClose asChild>
                            <Button variant={'destructive'}
                              onClick={() => {
                                deleteCollection.mutate({ id: collection.id });
                              }}
                            >Confirm Delete</Button>
                          </DialogClose>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>


            </div >
          </>
          );
        },
      },
    ];
    return columns;
  }, [lang, locale, topic, deleteCollection]);

  return columns;
};

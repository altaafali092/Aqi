import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { EyeIcon, Pencil, Trash } from "lucide-react";
import { Ward } from "@/types/Admin/Ward";
import { destroy, edit } from "@/routes/admin/wards";


export const columns: ColumnDef<Ward>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },


    {
        accessorKey: "number",
        header: "Ward Number",
    },
    {
        accessorKey: "name",
        header: "Ward Name",
    },


    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const ward = row.original;

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(ward.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    {/* <Button variant="outline" size="sm" asChild>
                        <Link href={show(ward.id).url}>
                            <EyeIcon className="h-4 w-4" />
                        </Link>
                    </Button> */}

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this ward?"
                                )
                            ) {
                                router.delete(
                                    destroy(ward.id).url,
                                    {
                                        preserveScroll: true,
                                    }
                                );
                            }
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
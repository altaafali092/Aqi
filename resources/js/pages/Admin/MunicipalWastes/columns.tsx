import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { EyeIcon, Pencil, Trash } from "lucide-react";
import { MunicipalWaste } from "@/types/Admin/MunicipalWaste";
import { destroy, edit } from "@/routes/admin/municipal-wastes";



export const columns: ColumnDef<MunicipalWaste>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },

    {
        accessorKey: "ward.number",
        header: "Ward Number",
    },
    {
        accessorKey: "waste_type",
        header: "Waste Type",
    },
    {
        accessorKey: 'weight_kg',
        header: "Waste kg",
    },
    {
        accessorKey: 'collection_date',
        header: "Collection Date",
        cell: ({ row }) => new Date(row.original.collection_date).toLocaleDateString(),
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const muncipleWaste = row.original;

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(muncipleWaste.id).url}>
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
                                    destroy(muncipleWaste.id).url,
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
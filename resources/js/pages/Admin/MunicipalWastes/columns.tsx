import { Link, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destroy, edit } from "@/routes/admin/municipal-wastes";
import type { MunicipalWaste } from "@/types/Admin/MunicipalWaste";

// Change the export from a static array to a dynamic function
export const getColumns = (role: string | undefined): ColumnDef<MunicipalWaste>[] => {
    const baseColumns: ColumnDef<MunicipalWaste>[] = [
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
            accessorKey: 'kg_per_person_per_day',
            header: "kg/person/day",
            cell: ({ row }) => row.original.kg_per_person_per_day ?? '-',
        },
        {
            accessorKey: 'health_risk_level',
            header: "Health Risk",
            cell: ({ row }) => row.original.health_risk_level ?? 'Low',
        },
    ];

    // Only inject the actions column layout matrix if the role is admin
    if (role === 'admin') {
        baseColumns.push({
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

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                if (
                                    confirm(
                                        "Are you sure you want to delete this record?"
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
        });
    }

    return baseColumns;
};
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import { columns } from './columns';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { PaginatedData } from '@/types';

import Pagination from '@/components/Pagination';
import { MunicipalWaste } from '@/types/Admin/MunicipalWaste';
import { create, index } from '@/routes/admin/municipal-wastes';



interface Props {
    municipalWastes: PaginatedData<MunicipalWaste>;
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Municipal Wastes',
            href: index(),
        },
    ],
};

export default function Index({ municipalWastes }: Props) {
    return (
        <>
            <Head title="Munciple Wastes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Munciple Wastes</h1>
                        <p className="text-muted-foreground">
                            Manage application Munciple Wastes.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create
                        </Link>
                    </Button>
                </div>


                <div className="flex-1">
                    <div className="flex-1">
                        <div className="container mx-auto py-6">
                            <DataTable
                                columns={columns}
                                data={municipalWastes.data || []}
                            />
                            <Pagination links={municipalWastes.links} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import { columns } from './columns';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { PaginatedData } from '@/types';

import { Ward } from '@/types/Admin/Ward';
import { create, index } from '@/routes/admin/wards';
import Pagination from '@/components/Pagination';



interface Props {
    wards: PaginatedData<Ward>;
}

PermissionIndex.layout = {
    breadcrumbs: [
        {
            title: 'wards',
            href: index(),
        },
    ],
};

export default function PermissionIndex({ wards }: Props) {
    return (
        <>
            <Head title="wards" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Wards</h1>
                        <p className="text-muted-foreground">
                            Manage application wards.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Ward
                        </Link>
                    </Button>
                </div>


                <div className="flex-1">
                    <div className="flex-1">
                        <div className="container mx-auto py-6">
                            <DataTable
                                columns={columns}
                                data={wards.data || []}

                            />
                            <Pagination links={wards.links} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import { getColumns } from './columns'; // Updated to import getColumns function
import { Head, Link, usePage } from '@inertiajs/react'; // Imported usePage hook
import { DataTable } from '@/components/data-table';
import { PaginatedData } from '@/types';

import Pagination from '@/components/Pagination';
import { MunicipalWaste } from '@/types/Admin/MunicipalWaste';
import { create, index } from '@/routes/admin/municipal-wastes';

interface Props {
    municipalWastes: PaginatedData<MunicipalWaste>;
}

// Define explicit types matching your shared Inertia auth state structure
interface PageProps extends Record<string, unknown> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
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
    // 1. Pull the shared authorization properties down from Inertia context
    const { auth } = usePage<PageProps>().props;
    const userRole = auth?.user?.role;
    const isAdmin = userRole === 'admin';

    // 2. Generate the visual data-table column schemas dynamically
    const tableColumns = getColumns(userRole);

    return (
        <>
            <Head title="Municipal Wastes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Municipal Wastes</h1>
                        <p className="text-muted-foreground">
                            Manage application Municipal Wastes.
                        </p>
                    </div>

                    {/* 3. Conditional UI Check: Only display 'Create' button option to admins */}
                    {isAdmin && (
                        <Button asChild>
                            <Link href={create()} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex-1">
                        <div className="container mx-auto py-6">
                            {/* 4. Supply dynamically calculated columns profile to TanStack layout wrapper */}
                            <DataTable
                                columns={tableColumns}
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
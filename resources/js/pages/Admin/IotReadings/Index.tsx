import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { PaginatedData } from '@/types';
import { IotReading } from '@/types/Admin/IotReading';
import { columns } from './columns';
import Pagination from '@/components/Pagination';

interface Props {
    readings: PaginatedData<IotReading>;
    wards: any[];
    filters?: Record<string, any>;
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Iot Readings',
            href: '/admin/iot-readings',
        },
    ],
};

export default function Index({ readings }: Props) {
    return (
        <>
            <Head title="IoT Readings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">IoT Readings</h1>
                        <p className="text-muted-foreground">List of recent sensor readings.</p>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="container mx-auto py-6">
                        <DataTable columns={columns} data={readings.data || []} />
                        <Pagination links={readings.links} />
                    </div>
                </div>
            </div>
        </>
    );
}

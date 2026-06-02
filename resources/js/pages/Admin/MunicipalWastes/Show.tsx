import { Head } from '@inertiajs/react';

export default function Show({ municipalWaste }: any) {
    return (
        <>
            <Head title="Municipal Waste" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Municipal Waste Details</h1>
                <pre>{JSON.stringify(municipalWaste || {}, null, 2)}</pre>
            </div>
        </>
    );
}

import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import { index, store } from '@/routes/admin/municipal-wastes';
import { Ward } from '@/types/Admin/Ward';


Create.layout = {
    breadcrumbs: [
        {
            title: 'Municipal Wastes',
            href: index(),
        },
        {
            title: 'Create Municipal Waste',
            href: "#",
        },
    ],
};
interface WardProps {
    wards: Ward[]
}

export default function Create({ wards }: WardProps) {
    const handleCancel = () => window.history.back()
    return (
        <>
            <Head title="Create Ward" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Municipal Waste</h1>
                        <p className="text-muted-foreground">
                            Add a new municipal waste to the system.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ward Details</CardTitle>
                        <CardDescription>
                            Fill in the information below to create a new ward.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={store().url}
                            method='POST'
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="ward_id">Ward Number</Label>
                                            <select
                                                id="ward_id"
                                                name="ward_id"
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                {wards.map((ward) => (
                                                    <option key={ward.id} value={ward.id}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.ward_id} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Waste Type</Label>
                                            <Input
                                                id="waste_type"
                                                name="waste_type"
                                                type="text"
                                                placeholder="e.g., Organic Waste"
                                            />
                                            <InputError message={errors.waste_type} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="weight_kg">Weight</Label>
                                            <Input
                                                id="weight_kg"
                                                name="weight_kg"
                                                type="number"
                                                placeholder="e.g., 100"
                                            />
                                            <InputError message={errors.weight_kg} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="collection_date">Collection Date</Label>
                                            <Input
                                                id="collection_date"
                                                name="collection_date"
                                                type="date"
                                                placeholder="e.g., 2026-06-03"
                                            />
                                            <InputError message={errors.collection_date} />
                                        </div>




                                    </div>


                                    {/* Buttons */}
                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit">Save</Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>

                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store } from '@/routes/admin/municipal-wastes';
import type { Ward } from '@/types/Admin/Ward';


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
                            {({ errors }) => (
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

                                        <div className="space-y-2">
                                            <Label htmlFor="population_served">Population Served</Label>
                                            <Input
                                                id="population_served"
                                                name="population_served"
                                                type="number"
                                                min="1"
                                                placeholder="e.g., 2500"
                                            />
                                            <InputError message={errors.population_served} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reporting_period_days">Reporting Period Days</Label>
                                            <Input
                                                id="reporting_period_days"
                                                name="reporting_period_days"
                                                type="number"
                                                min="1"
                                                max="31"
                                                defaultValue={1}
                                            />
                                            <InputError message={errors.reporting_period_days} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="collection_status">Collection Status</Label>
                                            <select
                                                id="collection_status"
                                                name="collection_status"
                                                defaultValue="collected"
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="collected">Collected</option>
                                                <option value="partial">Partial</option>
                                                <option value="missed">Missed</option>
                                                <option value="overflowing">Overflowing</option>
                                            </select>
                                            <InputError message={errors.collection_status} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="segregation_quality">Segregation Quality</Label>
                                            <select
                                                id="segregation_quality"
                                                name="segregation_quality"
                                                defaultValue="mixed"
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="segregated">Segregated</option>
                                                <option value="partially_segregated">Partially Segregated</option>
                                                <option value="mixed">Mixed</option>
                                            </select>
                                            <InputError message={errors.segregation_quality} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="organic_weight_kg">Organic Waste kg</Label>
                                            <Input id="organic_weight_kg" name="organic_weight_kg" type="number" min="0" step="0.01" />
                                            <InputError message={errors.organic_weight_kg} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="recyclable_weight_kg">Recyclable Waste kg</Label>
                                            <Input id="recyclable_weight_kg" name="recyclable_weight_kg" type="number" min="0" step="0.01" />
                                            <InputError message={errors.recyclable_weight_kg} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="hazardous_weight_kg">Hazardous Waste kg</Label>
                                            <Input id="hazardous_weight_kg" name="hazardous_weight_kg" type="number" min="0" step="0.01" />
                                            <InputError message={errors.hazardous_weight_kg} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="medical_weight_kg">Medical Waste kg</Label>
                                            <Input id="medical_weight_kg" name="medical_weight_kg" type="number" min="0" step="0.01" />
                                            <InputError message={errors.medical_weight_kg} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="overflow_spots">Overflow Spots</Label>
                                            <Input id="overflow_spots" name="overflow_spots" type="number" min="0" max="255" defaultValue={0} />
                                            <InputError message={errors.overflow_spots} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="odor_level">Odor Level</Label>
                                            <Input id="odor_level" name="odor_level" type="number" min="0" max="5" defaultValue={0} />
                                            <InputError message={errors.odor_level} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="missed_collection_days">Missed Collection Days</Label>
                                            <Input id="missed_collection_days" name="missed_collection_days" type="number" min="0" defaultValue={0} />
                                            <InputError message={errors.missed_collection_days} />
                                        </div>

                                        <label className="flex items-center gap-2 text-sm font-medium">
                                            <input type="hidden" name="standing_water" value="0" />
                                            <input id="standing_water" name="standing_water" type="checkbox" value="1" />
                                            Standing water near waste
                                        </label>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                placeholder="Operational notes, complaint details, hotspot location, or pickup remarks"
                                            />
                                            <InputError message={errors.notes} />
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

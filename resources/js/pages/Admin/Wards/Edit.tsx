import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import { index, update } from '@/routes/admin/wards';
import { Ward } from '@/types/Admin/Ward';


WardEdit.layout = {
    breadcrumbs: [
        {
            title: 'Wards',
            href: index(),
        },
        {
            title: 'Edit Ward',
            href: "#",
        },
    ],
};

interface WardProps {
    ward: Ward;
}
export default function WardEdit({ ward }: WardProps) {
    const handleCancel = () => window.history.back()
    return (
        <>
            <Head title="Edit Ward" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Ward</h1>
                        <p className="text-muted-foreground">
                            Edit ward details
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ward Details</CardTitle>
                        <CardDescription>
                            Update the information below to edit the ward.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={update(ward.id)}
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="_method" value="put" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="number">Ward Number</Label>
                                            <Input
                                                id="number"
                                                name="number"
                                                type="number"
                                                defaultValue={ward.number}
                                            />
                                            <InputError message={errors.number} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Ward Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                defaultValue={ward.name}
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="boundary">Boundary</Label>
                                            <Input
                                                id="boundary"
                                                name="boundary"
                                                type="text"
                                                defaultValue={ward.boundary}
                                            />
                                            <InputError message={errors.boundary} />
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
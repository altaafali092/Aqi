import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import { create, index, store } from '@/routes/admin/wards';
import { Textarea } from '@/components/ui/textarea';

WardCreate.layout = {
    breadcrumbs: [
        {
            title: 'Wards',
            href: index(),
        },
        {
            title: 'Create Ward',
            href: create(),
        },
    ],
};

export default function WardCreate() {
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
                        <h1 className="text-2xl font-bold tracking-tight">Create Ward</h1>
                        <p className="text-muted-foreground">
                            Add a new ward to the system.
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
                            {...store.form()}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="number">Ward Number</Label>
                                            <Input
                                                id="number"
                                                name="number"
                                                type="number"
                                                placeholder="e.g., 01"
                                            />
                                            <InputError message={errors.number} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Ward Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="e.g., Ward 1"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="boundary">Boundary</Label>
                                            <Input
                                                id="boundary"
                                                name="boundary"
                                                type="text"
                                                placeholder="e.g., [[111,111],[111,111]]"
                                            />
                                            <InputError message={errors.name} />
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
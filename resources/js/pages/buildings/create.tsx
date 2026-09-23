import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import buildings from '@/routes/buildings';
import { ArrowLeft, Building2 } from 'lucide-react';

interface Project {
    id: number;
    name: string;
}

export default function Create() {
    const { projects, errors } = usePage<{ projects: Project[]; errors: Record<string, string> }>().props;
    const [data, setData] = useState({
        name: '',

        address: '',
        total_floors: 0,
        total_units: 0,
        status: 'planned',
        description: '',
        project_id: '',
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (field: string, value: string | number) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/buildings', data, {
            onSuccess: () => {
                toast.success('Building created');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Create Building" />

            <div className="flex items-center gap-2 mb-6">
                <Link href="/buildings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <Building2 className="size-6" />
                <h1 className="text-2xl font-semibold">Create Building</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Building Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <SearchableSelect
                                    label="Project"
                                    placeholder="Select Project..."
                                    options={projects.map(p => ({ value: String(p.id), label: p.name }))}
                                    value={data.project_id}
                                    onChange={(v) => handleChange('project_id', v)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Building Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_floors">Total Floors</Label>
                                <Input
                                    id="total_floors"
                                    type="number"
                                    min={0}
                                    value={data.total_floors}
                                    onChange={(e) => handleChange('total_floors', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_units">Total Units</Label>
                                <Input
                                    id="total_units"
                                    type="number"
                                    min={0}
                                    value={data.total_units}
                                    onChange={(e) => handleChange('total_units', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => handleChange('status', v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="under_construction">Under Construction</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <textarea
                                id="address"
                                className="border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                                value={data.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                                value={data.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Building'}
                            </Button>
                            <Link href="/buildings">
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Buildings', href: buildings.index() },
        { title: 'Create', href: buildings.create() },
    ],
};

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import designations from '@/routes/designations';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

interface DepartmentOpt {
    id: number;
    name: string;
}

export default function Create() {
    const { departments } = usePage<{ departments: DepartmentOpt[] }>().props;
    const [form, setForm] = useState({
        name: '',
        department_id: '',
        code: '',
        level: '',
        status: 'active',
    });
    const [processing, setProcessing] = useState(false);

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.post(designations.store().url, form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Designation created');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Add Designation" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={designations.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Add Designation</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Designation Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Designation Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
                                </div>
                                <SearchableSelect
                                    label="Department"
                                    placeholder="Select Department..."
                                    options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
                                    value={form.department_id}
                                    onChange={(v) => set('department_id', v)}
                                />
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input id="code" value={form.code} onChange={(e) => set('code', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Input id="level" value={form.level} onChange={(e) => set('level', e.target.value)} placeholder="e.g. C-Level, Mid, Entry" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={form.status} onValueChange={(v) => set('status', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Status..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={designations.index().url}>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Designations', href: designations.index().url },
        { title: 'Create', href: designations.create().url },
    ],
};
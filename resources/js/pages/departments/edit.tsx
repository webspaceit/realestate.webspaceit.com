import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import departments from '@/routes/departments';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageProps {
    department: {
        id: number;
        name: string;
        code: string | null;
        description: string | null;
        status: string;
    };
}

export default function Edit() {
    const { department } = usePage<PageProps>().props;
    const [form, setForm] = useState({
        name: department.name,
        code: department.code || '',
        description: department.description || '',
        status: department.status,
    });
    const [processing, setProcessing] = useState(false);

    function set(field: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(departments.update(department.id).url, form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Department updated');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Edit Department" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={departments.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Department</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Department Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Department Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input id="code" value={form.code} onChange={(e) => set('code', e.target.value)} />
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
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={departments.index().url}>
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

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Departments', href: departments.index().url },
    ],
};
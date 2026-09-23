import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import assignments from '@/routes/contractor-assignments';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

interface Contractor {
    id: number;
    company_name: string;
}

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
}

export default function Create() {
    const { contractors, projects } = usePage<{ contractors: Contractor[]; projects: Project[] }>().props;
    const [form, setForm] = useState({
        contractor_id: '',
        project_id: '',
        task_id: '',
        contract_amount: '',
        start_date: '',
        end_date: '',
        status: 'pending',
    });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.post(assignments.store().url, {
            ...form,
            contractor_id: form.contractor_id ? Number(form.contractor_id) : undefined,
            project_id: form.project_id ? Number(form.project_id) : undefined,
            task_id: form.task_id ? Number(form.task_id) : undefined,
            contract_amount: form.contract_amount ? Number(form.contract_amount) : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Assignment created');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    }

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <>
            <Head title="Create Assignment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={assignments.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Assignment</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <SearchableSelect
                                    label="Contractor"
                                    placeholder="Select Contractor..."
                                    value={form.contractor_id}
                                    onChange={(v) => set('contractor_id', v)}
                                    options={contractors.map((c) => ({ value: String(c.id), label: c.company_name }))}
                                />
                                <SearchableSelect
                                    label="Project"
                                    placeholder="Select Project..."
                                    value={form.project_id}
                                    onChange={(v) => set('project_id', v)}
                                    options={projects.map((p) => ({ value: String(p.id), label: p.name }))}
                                />
                                <SearchableSelect
                                    label="Task (optional)"
                                    placeholder="Select Task..."
                                    value={form.task_id}
                                    onChange={(v) => set('task_id', v)}
                                    options={[{ value: ' ', label: 'No task' }]}
                                />
                                <div className="space-y-2">
                                    <Label htmlFor="contract_amount">Contract Amount</Label>
                                    <Input id="contract_amount" type="number" step="0.01" value={form.contract_amount} onChange={(e) => set('contract_amount', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input id="start_date" type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input id="end_date" type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={form.status} onValueChange={(v) => set('status', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Status..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="terminated">Terminated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={assignments.index().url}>
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
        { title: 'Assignments', href: assignments.index().url },
        { title: 'Create', href: assignments.create().url },
    ],
};

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

interface Assignment {
    id: number;
    contractor: Contractor;
    project: Project;
    task: Task | null;
    contract_amount: number;
    start_date: string;
    end_date: string;
    status: string;
}

export default function Edit() {
    const { contractorAssignment, contractors, projects, tasks } = usePage<{ contractorAssignment: Assignment; contractors: Contractor[]; projects: Project[]; tasks: Task[] }>().props;
    const [form, setForm] = useState({
        contractor_id: String(contractorAssignment.contractor.id),
        project_id: String(contractorAssignment.project.id),
        task_id: contractorAssignment.task ? String(contractorAssignment.task.id) : '',
        contract_amount: String(contractorAssignment.contract_amount),
        start_date: contractorAssignment.start_date || '',
        end_date: contractorAssignment.end_date || '',
        status: contractorAssignment.status,
    });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(assignments.update(contractorAssignment.id).url, {
            ...form,
            contractor_id: form.contractor_id ? Number(form.contractor_id) : undefined,
            project_id: form.project_id ? Number(form.project_id) : undefined,
            task_id: form.task_id ? Number(form.task_id) : undefined,
            contract_amount: form.contract_amount ? Number(form.contract_amount) : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Assignment updated');
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
            <Head title="Edit Assignment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={assignments.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Assignment</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contractor_id">Contractor</Label>
                                    <Select value={form.contractor_id} onValueChange={(v) => set('contractor_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Contractor..." /></SelectTrigger>
                                        <SelectContent>
                                            {contractors.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.company_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project_id">Project</Label>
                                    <Select value={form.project_id} onValueChange={(v) => set('project_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Project..." /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="task_id">Task (optional)</Label>
                                    <Select value={form.task_id} onValueChange={(v) => set('task_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Task..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">No task</SelectItem>
                                        {tasks?.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
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
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update'}</Button>
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

Edit.layout = (props: { contractorAssignment: Assignment }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Assignments', href: assignments.index().url },
        { title: 'Edit', href: assignments.edit(props.contractorAssignment.id).url },
    ],
});

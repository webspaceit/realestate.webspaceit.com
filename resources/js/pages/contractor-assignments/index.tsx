import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import assignments from '@/routes/contractor-assignments';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

interface Assignment {
    id: number;
    contractor: { id: number; company_name: string };
    project: { id: number; name: string };
    task: { id: number; name: string } | null;
    contract_amount: number;
    start_date: string;
    end_date: string;
    status: string;
}

interface Contractor {
    id: number;
    company_name: string;
}

interface Project {
    id: number;
    name: string;
}

interface PageProps {
    contractorAssignments: { data: Assignment[]; current_page: number; last_page: number; per_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { contractor_id?: string; project_id?: string };
    contractors: Contractor[];
    projects: Project[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    pending: 'outline',
    completed: 'secondary',
    terminated: 'destructive',
};

export default function Index() {
    const { contractorAssignments, filters, contractors, projects } = usePage<PageProps>().props;
    const [contractorId, setContractorId] = useState(filters.contractor_id || '');
    const [projectId, setProjectId] = useState(filters.project_id || '');

    function applyFilters() {
        router.get(assignments.index().url, { contractor_id: contractorId, project_id: projectId }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(a: Assignment) {
        if (!confirm('Delete this assignment?')) return;
        router.delete(assignments.destroy(a.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Assignment deleted'),
        });
    }

    return (
        <>
            <Head title="Contractor Assignments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Contractor Assignments</h1>
                    <Link href={assignments.create().url}>
                        <Button><Plus className="mr-2 h-4 w-4" />Add Assignment</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Select value={contractorId} onValueChange={(v) => { setContractorId(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="All contractors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All contractors</SelectItem>
                                    {contractors.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.company_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={projectId} onValueChange={(v) => { setProjectId(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="All projects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All projects</SelectItem>
                                    {projects.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={applyFilters}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contractor</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contractorAssignments.data.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.contractor?.company_name || '-'}</TableCell>
                                        <TableCell>{a.project?.name || '-'}</TableCell>
                                        <TableCell>{a.task?.name || '-'}</TableCell>
                                        <TableCell>{Number(a.contract_amount).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[a.status] || 'outline'}>{a.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={assignments.show(a.id).url}>
                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                </Link>
                                                <Link href={assignments.edit(a.id).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(a)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {contractorAssignments.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No assignments found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {contractorAssignments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {contractorAssignments.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Assignments', href: assignments.index().url },
    ],
};

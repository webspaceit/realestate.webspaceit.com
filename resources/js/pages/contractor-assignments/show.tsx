import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import assignments from '@/routes/contractor-assignments';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    pending: 'outline',
    completed: 'secondary',
    terminated: 'destructive',
};

export default function Show() {
    const { contractorAssignment: a } = usePage<{ contractorAssignment: Assignment }>().props;

    function handleDelete() {
        if (!confirm('Delete this assignment?')) return;
        router.delete(assignments.destroy(a.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Assignment deleted'),
        });
    }

    return (
        <>
            <Head title="Assignment Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={assignments.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Assignment Details</h1>
                    <div className="ml-auto flex gap-2">
                        <Link href={assignments.edit(a.id).url}>
                            <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Assignment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Contractor</span>
                                <p className="font-medium">{a.contractor.company_name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Project</span>
                                <p className="font-medium">{a.project.name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Task</span>
                                <p className="font-medium">{a.task?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div className="mt-1">
                                    <Badge variant={statusVariant[a.status] || 'outline'}>{a.status}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financial & Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Contract Amount</span>
                                <p className="text-lg font-bold">{Number(a.contract_amount).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Start Date</span>
                                <p className="font-medium">{a.start_date || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">End Date</span>
                                <p className="font-medium">{a.end_date || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Show.layout = (props: { contractorAssignment: Assignment }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Assignments', href: assignments.index().url },
        { title: `#${props.contractorAssignment.id}`, href: assignments.show(props.contractorAssignment.id).url },
    ],
});

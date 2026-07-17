import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Pencil, FolderKanban, ListChecks, Flag } from 'lucide-react'
import { dashboard } from '@/routes'
import projects from '@/routes/projects'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Building {
    id: number
    name: string
}

interface Phase {
    id: number
    name: string
    status: string
    start_date: string
    end_date: string
}

interface Milestone {
    id: number
    name: string
    due_date: string
    status: string
}

interface BudgetItem {
    id: number
    category: string
    amount: number
}

interface ContractorAssignment {
    id: number
    contractor: { id: number; company_name: string }
}

interface Project {
    id: number
    name: string
    building: Building | null
    project_type: { id: number; name: string } | null
    code: string | null
    description: string
    start_date: string
    end_date: string
    budget: number
    land_size_katha: number | null
    land_details: string | null
    rajuk_file_submit_date: string | null
    rajuk_permission_status: string
    total_unit: number | null
    total_flat: number | null
    total_floor: number | null
    total_parking: number | null
    status: string
    division: { id: number; name: string } | null
    district: { id: number; name: string } | null
    thana: { id: number; name: string } | null
    address: string | null
    created_at: string
    phases: Phase[]
    milestones: Milestone[]
    budgets: BudgetItem[]
    contractor_assignments: ContractorAssignment[]
}

interface Props {
    project: Project
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planning: 'secondary',
    in_progress: 'default',
    completed: 'outline',
    on_hold: 'destructive',
    pending: 'secondary',
    achieved: 'default',
    missed: 'destructive',
}

export default function Show() {
    const { project } = usePage<Props>().props

    return (
        <>
            <Head title={project.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={projects.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-semibold">{project.name}</h1>
                        <Badge variant={statusVariant[project.status]}>{project.status.replace('_', ' ')}</Badge>
                    </div>
                    <Link href={projects.edit.url({ project: project.id })}>
                        <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-semibold">৳{Number(project.budget).toLocaleString()}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Duration</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{project.start_date} &mdash; {project.end_date}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Land Size</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-semibold">{project.land_size_katha ?? '-'} Katha</p></CardContent>
                    </Card>
                    {project.total_unit != null && (
                        <Card>
                            <CardHeader><CardTitle>Total Unit</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-semibold">{project.total_unit}</p></CardContent>
                        </Card>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {project.total_flat != null && (
                        <Card>
                            <CardHeader><CardTitle>Total Flat</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-semibold">{project.total_flat}</p></CardContent>
                        </Card>
                    )}
                    {project.total_floor != null && (
                        <Card>
                            <CardHeader><CardTitle>Total Floor</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-semibold">{project.total_floor}</p></CardContent>
                        </Card>
                    )}
                    {project.total_parking != null && (
                        <Card>
                            <CardHeader><CardTitle>Total Parking</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-semibold">{project.total_parking}</p></CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground">{project.description || 'No description provided.'}</p></CardContent>
                </Card>

                {project.land_details && (
                    <Card>
                        <CardHeader><CardTitle>Details of The Land</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground">{project.land_details}</p></CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Rajuk File Submit Date</CardTitle></CardHeader>
                        <CardContent><p>{project.rajuk_file_submit_date || 'N/A'}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Rajuk Permission Status</CardTitle></CardHeader>
                        <CardContent>
                            <Badge variant={project.rajuk_permission_status === 'approved' ? 'default' : 'secondary'}>
                                {project.rajuk_permission_status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Address</CardTitle></CardHeader>
                    <CardContent>
                        <p>{[project.division?.name, project.district?.name, project.thana?.name].filter(Boolean).join(', ') || 'N/A'}</p>
                        {project.address && <p className="text-muted-foreground mt-1">{project.address}</p>}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2"><FolderKanban className="h-5 w-5" /><CardTitle>Phases</CardTitle></CardHeader>
                        <CardContent>
                            {project.phases?.length ? (
                                <div className="divide-y">
                                    {project.phases.map(phase => (
                                        <div key={phase.id} className="flex items-center justify-between py-2">
                                            <span className="font-medium">{phase.name}</span>
                                            <Badge variant={statusVariant[phase.status]}>{phase.status.replace('_', ' ')}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-muted-foreground">No phases yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2"><Flag className="h-5 w-5" /><CardTitle>Milestones</CardTitle></CardHeader>
                        <CardContent>
                            {project.milestones?.length ? (
                                <div className="divide-y">
                                    {project.milestones.map(m => (
                                        <div key={m.id} className="flex items-center justify-between py-2">
                                            <div><span className="font-medium">{m.name}</span><p className="text-xs text-muted-foreground">{m.due_date}</p></div>
                                            <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-muted-foreground">No milestones yet.</p>}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2"><ListChecks className="h-5 w-5" /><CardTitle>Budgets</CardTitle></CardHeader>
                        <CardContent>
                            {project.budgets?.length ? (
                                <div className="divide-y">
                                    {project.budgets.map(b => (
                                        <div key={b.id} className="flex items-center justify-between py-2">
                                            <span>{b.category}</span>
                                            <span className="font-medium">{Number(b.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-muted-foreground">No budgets yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2"><FolderKanban className="h-5 w-5" /><CardTitle>Contractors</CardTitle></CardHeader>
                        <CardContent>
                            {project.contractor_assignments?.length ? (
                                <div className="divide-y">
                                    {project.contractor_assignments.map(ca => (
                                        <div key={ca.id} className="py-2"><span className="font-medium">{ca.contractor?.company_name}</span></div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-muted-foreground">No contractors assigned.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

Show.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projects.index.url() },
        { title: props.project.name, href: projects.show.url({ project: props.project.id }) },
    ],
})

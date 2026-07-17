import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Pencil, ListChecks } from 'lucide-react'
import { dashboard } from '@/routes'
import phases from '@/routes/phases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Project {
    id: number
    name: string
}

interface Task {
    id: number
    name: string
    assigned_to_user: { id: number; name: string } | null
    status: string
    priority: string
    start_date: string
    end_date: string
}

interface Phase {
    id: number
    project: Project
    name: string
    description: string
    start_date: string
    end_date: string
    status: string
    order: number
    tasks: Task[]
}

interface Props {
    phase: Phase
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planning: 'secondary',
    in_progress: 'default',
    completed: 'outline',
    on_hold: 'destructive',
    todo: 'secondary',
    done: 'outline',
}

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    urgent: 'destructive',
}

export default function Show() {
    const { phase } = usePage<Props>().props

    return (
        <>
            <Head title={phase.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={phases.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-semibold">{phase.name}</h1>
                        <Badge variant={statusVariant[phase.status]}>{phase.status.replace('_', ' ')}</Badge>
                    </div>
                    <Link href={phases.edit.url({ phase: phase.id })}>
                        <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Project</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{phase.project?.name}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Order</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{phase.order}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Start Date</CardTitle></CardHeader>
                        <CardContent><p>{phase.start_date || 'N/A'}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>End Date</CardTitle></CardHeader>
                        <CardContent><p>{phase.end_date || 'N/A'}</p></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground">{phase.description || 'No description provided.'}</p></CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2"><ListChecks className="h-5 w-5" /><CardTitle>Tasks</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Assigned To</th>
                                    <th className="p-3 font-medium">Priority</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Dates</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phase.tasks?.length ? phase.tasks.map(task => (
                                    <tr key={task.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium">{task.name}</td>
                                        <td className="p-3">{task.assigned_to_user?.name || 'Unassigned'}</td>
                                        <td className="p-3"><Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge></td>
                                        <td className="p-3"><Badge variant={statusVariant[task.status]}>{task.status.replace('_', ' ')}</Badge></td>
                                        <td className="p-3 text-muted-foreground">{task.start_date} &mdash; {task.end_date}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-3 text-center text-muted-foreground">No tasks yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Show.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Phases', href: phases.index.url() },
        { title: props.phase.name, href: phases.show.url({ phase: props.phase.id }) },
    ],
})

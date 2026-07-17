import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Pencil } from 'lucide-react'
import { dashboard } from '@/routes'
import tasks from '@/routes/tasks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Phase {
    id: number
    name: string
    project: { name: string }
}

interface User {
    id: number
    name: string
}

interface Task {
    id: number
    phase: Phase
    name: string
    description: string
    assigned_to: User | null
    start_date: string
    end_date: string
    status: string
    priority: string
    created_at: string
}

interface Props {
    task: Task
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    todo: 'secondary',
    in_progress: 'default',
    done: 'outline',
}

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    urgent: 'destructive',
}

export default function Show() {
    const { task } = usePage<Props>().props

    return (
        <>
            <Head title={task.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={tasks.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-semibold">{task.name}</h1>
                        <Badge variant={statusVariant[task.status]}>{task.status.replace('_', ' ')}</Badge>
                        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                    </div>
                    <Link href={tasks.edit.url({ task: task.id })}>
                        <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Project</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{task.phase?.project?.name}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Phase</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{task.phase?.name}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Assigned To</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{task.assigned_to?.name || 'Unassigned'}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Priority</CardTitle></CardHeader>
                        <CardContent><Badge variant={priorityVariant[task.priority]} className="text-base">{task.priority}</Badge></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Start Date</CardTitle></CardHeader>
                        <CardContent><p>{task.start_date || 'N/A'}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>End Date</CardTitle></CardHeader>
                        <CardContent><p>{task.end_date || 'N/A'}</p></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground">{task.description || 'No description provided.'}</p></CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Status</span><p className="font-medium"><Badge variant={statusVariant[task.status]}>{task.status.replace('_', ' ')}</Badge></p></div>
                            <div><span className="text-muted-foreground">Created</span><p className="font-medium">{task.created_at}</p></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Show.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tasks', href: tasks.index.url() },
        { title: props.task.name, href: tasks.show.url({ task: props.task.id }) },
    ],
})

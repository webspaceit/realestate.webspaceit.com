import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Pencil } from 'lucide-react'
import { dashboard } from '@/routes'
import milestones from '@/routes/milestones'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Project {
    id: number
    name: string
}

interface Milestone {
    id: number
    project: Project
    name: string
    description: string
    due_date: string
    status: string
    created_at: string
}

interface Props {
    milestone: Milestone
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    achieved: 'default',
    missed: 'destructive',
}

export default function Show() {
    const { milestone } = usePage<Props>().props

    return (
        <>
            <Head title={milestone.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={milestones.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-semibold">{milestone.name}</h1>
                        <Badge variant={statusVariant[milestone.status]}>{milestone.status}</Badge>
                    </div>
                    <Link href={milestones.edit.url({ milestone: milestone.id })}>
                        <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Project</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{milestone.project?.name}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Due Date</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-semibold">{milestone.due_date || 'N/A'}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent><Badge variant={statusVariant[milestone.status]} className="text-base">{milestone.status}</Badge></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground">{milestone.description || 'No description provided.'}</p></CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Created</span><p className="font-medium">{milestone.created_at}</p></div>
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
        { title: 'Milestones', href: milestones.index.url() },
        { title: props.milestone.name, href: milestones.show.url({ milestone: props.milestone.id }) },
    ],
})

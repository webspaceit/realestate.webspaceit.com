import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { dashboard } from '@/routes'
import milestones from '@/routes/milestones'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

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
}

interface Props {
    milestones: { data: Milestone[]; current_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] }
    projects: Project[]
    filters: { project_id?: string; status?: string }
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    achieved: 'default',
    missed: 'destructive',
}

export default function Index() {
    const { milestones: data, projects, filters } = usePage<Props>().props
    const [projectId, setProjectId] = useState(filters.project_id || '')
    const [status, setStatus] = useState(filters.status || '')

    function handleFilter() {
        router.get(milestones.index.url(), { project_id: projectId, status, page: 1 }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure?')) return
        router.delete(milestones.destroy.url({ milestone: id }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Milestone deleted'),
        })
    }

    return (
        <>
            <Head title="Milestones" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Milestones</h1>
                    <Link href={milestones.create.url()}><Button><Plus className="mr-2 h-4 w-4" /> New Milestone</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <select className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={projectId} onChange={e => setProjectId(e.target.value)}>
                                <option value="">All Projects</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="achieved">Achieved</option>
                                <option value="missed">Missed</option>
                            </select>
                            <Button onClick={handleFilter}><Search className="mr-2 h-4 w-4" /> Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map(milestone => (
                                    <TableRow key={milestone.id}>
                                        <TableCell className="font-medium">{milestone.name}</TableCell>
                                        <TableCell>{milestone.project?.name}</TableCell>
                                        <TableCell>{milestone.due_date}</TableCell>
                                        <TableCell><Badge variant={statusVariant[milestone.status]}>{milestone.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={milestones.show.url({ milestone: milestone.id })}><Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={milestones.edit.url({ milestone: milestone.id })}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button></Link>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(milestone.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No milestones found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {data.links.map((link, i) => (
                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Milestones', href: milestones.index.url() },
    ],
}

import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { dashboard } from '@/routes'
import phases from '@/routes/phases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

interface Project {
    id: number
    name: string
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
}

interface Props {
    phases: { data: Phase[]; current_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] }
    projects: Project[]
    filters: { project_id?: string; status?: string }
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planning: 'secondary',
    in_progress: 'default',
    completed: 'outline',
    on_hold: 'destructive',
}

export default function Index() {
    const { phases: data, projects: projList, filters } = usePage<Props>().props
    const [projectId, setProjectId] = useState(filters.project_id || '')
    const [status, setStatus] = useState(filters.status || '')

    function handleFilter() {
        router.get(phases.index.url(), { project_id: projectId, status, page: 1 }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure?')) return
        router.delete(phases.destroy.url({ phase: id }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Phase deleted'),
        })
    }

    return (
        <>
            <Head title="Phases" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Phases</h1>
                    <Link href={phases.create.url()}><Button><Plus className="mr-2 h-4 w-4" /> New Phase</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <select className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={projectId} onChange={e => setProjectId(e.target.value)}>
                                <option value="">All Projects</option>
                                {projList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="planning">Planning</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on_hold">On Hold</option>
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
                                    <TableHead>Order</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map(phase => (
                                    <TableRow key={phase.id}>
                                        <TableCell>{phase.order}</TableCell>
                                        <TableCell className="font-medium">{phase.name}</TableCell>
                                        <TableCell>{phase.project?.name}</TableCell>
                                        <TableCell>{phase.start_date}</TableCell>
                                        <TableCell>{phase.end_date}</TableCell>
                                        <TableCell><Badge variant={statusVariant[phase.status]}>{phase.status.replace('_', ' ')}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={phases.show.url({ phase: phase.id })}><Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={phases.edit.url({ phase: phase.id })}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button></Link>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(phase.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No phases found.</TableCell></TableRow>
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
        { title: 'Phases', href: phases.index.url() },
    ],
}

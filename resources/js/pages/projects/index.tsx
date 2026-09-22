import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { dashboard } from '@/routes'
import projects from '@/routes/projects'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

interface Building {
    id: number
    name: string
}

interface Project {
    id: number
    name: string
    building: Building
    description: string
    start_date: string
    end_date: string
    budget: number
    status: string
    created_at: string
}

interface Props {
    projects: { data: Project[]; current_page: number; per_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] }
    buildings: Building[]
    filters: { search?: string; status?: string; building_id?: string }
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planning: 'secondary',
    in_progress: 'default',
    completed: 'outline',
    on_hold: 'destructive',
}

export default function Index() {
    const { projects: data, buildings, filters } = usePage<Props>().props
    const [search, setSearch] = useState(filters.search || '')
    const [status, setStatus] = useState(filters.status || '')
    const [buildingId, setBuildingId] = useState(filters.building_id || '')

    const slNo = (index: number) => (data.current_page - 1) * data.per_page + index + 1

    function handleFilter() {
        router.get(projects.index.url(), { search, status, building_id: buildingId, page: 1 }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure?')) return
        router.delete(projects.destroy.url({ project: id }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Project deleted'),
        })
    }

    return (
        <>
            <Head title="Total Projects" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Total Projects</h1>
                    <Link href={projects.create.url()}>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Project</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="planning">Planning</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on_hold">On Hold</option>
                            </select>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={buildingId} onChange={e => setBuildingId(e.target.value)}>
                                <option value="">All Buildings</option>
                                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
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
                                    <TableHead className="w-12">Sl.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Building</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((project, i) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="text-muted-foreground">{slNo(i)}</TableCell>
                                        <TableCell className="font-medium">{project.name}</TableCell>
                                        <TableCell>{project.building?.name}</TableCell>
                                        <TableCell>{project.start_date}</TableCell>
                                        <TableCell>{project.end_date}</TableCell>
                                        <TableCell>{Number(project.budget).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[project.status] || 'outline'}>{project.status.replace('_', ' ')}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={projects.show.url({ project: project.id })}><Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={projects.edit.url({ project: project.id })}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button></Link>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">No projects found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {data.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
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
        { title: 'Projects', href: projects.index.url() },
    ],
}

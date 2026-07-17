import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { dashboard } from '@/routes'
import tasks from '@/routes/tasks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

interface Phase {
    id: number
    name: string
    project: { name: string }
}

interface User {
    id: number
    name: string
    role: string
}

interface TaskItem {
    id: number
    phase: Phase
    name: string
    description: string
    assigned_to: User | null
    start_date: string
    end_date: string
    status: string
    priority: string
}

interface Props {
    tasks: { data: TaskItem[]; current_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] }
    phases: Phase[]
    users: User[]
    filters: { search?: string; phase_id?: string; assigned_to?: string; status?: string; role?: string }
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

export default function Index() {
    const { tasks: data, phases: phaseList, users, filters } = usePage<Props>().props
    const [search, setSearch] = useState(filters.search || '')
    const [phaseId, setPhaseId] = useState(filters.phase_id || '')
    const [assignedTo, setAssignedTo] = useState(filters.assigned_to || '')
    const [status, setStatus] = useState(filters.status || '')
    const [role, setRole] = useState(filters.role || '')

    const filteredUsers = role ? users.filter(u => u.role === role) : users

    function handleFilter() {
        router.get(tasks.index.url(), { search, phase_id: phaseId, assigned_to: assignedTo, status, role, page: 1 }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure?')) return
        router.delete(tasks.destroy.url({ task: id }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Task deleted'),
        })
    }

    return (
        <>
            <Head title="Tasks" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <Link href={tasks.create.url()}><Button><Plus className="mr-2 h-4 w-4" /> New Task</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1"><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={phaseId} onChange={e => setPhaseId(e.target.value)}>
                                <option value="">All Phases</option>
                                {phaseList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <select className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={role} onChange={e => { setRole(e.target.value); setAssignedTo('') }}>
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                <option value="client">Client</option>
                            </select>
                            <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                                <option value="">All Users</option>
                                {filteredUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            <select className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="todo">Todo</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
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
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.name}</TableCell>
                                        <TableCell>{task.phase?.name}</TableCell>
                                        <TableCell>{task.assigned_to?.name || '-'}</TableCell>
                                        <TableCell><Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge></TableCell>
                                        <TableCell><Badge variant={statusVariant[task.status]}>{task.status.replace('_', ' ')}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{task.start_date} &mdash; {task.end_date}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={tasks.show.url({ task: task.id })}><Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={tasks.edit.url({ task: task.id })}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button></Link>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No tasks found.</TableCell></TableRow>
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
        { title: 'Tasks', href: tasks.index.url() },
    ],
}

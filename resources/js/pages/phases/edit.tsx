import { useState, FormEvent } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { dashboard } from '@/routes'
import phases from '@/routes/phases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Project {
    id: number
    name: string
}

interface User {
    id: number
    name: string
}

interface Task {
    id: number
    name: string
    assigned_to: number | null
    priority: string
    status: string
    start_date: string | null
    end_date: string | null
    description: string | null
}

interface Phase {
    id: number
    project_id: number
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
    projects: Project[]
    users: User[]
}

export default function Edit() {
    const { phase, projects, users } = usePage<Props>().props
    const [form, setForm] = useState({
        project_id: String(phase.project_id),
        name: phase.name,
        description: phase.description || '',
        start_date: phase.start_date || '',
        end_date: phase.end_date || '',
        status: phase.status,
        order: String(phase.order || ''),
    })
    const [tasks, setTasks] = useState<Task[]>(phase.tasks || [])
    const [submitting, setSubmitting] = useState(false)

    function addTask() {
        setTasks(prev => [...prev, { id: 0, name: '', assigned_to: null, priority: 'medium', status: 'todo', start_date: null, end_date: null, description: null } as Task])
    }

    function removeTask(index: number) {
        setTasks(prev => prev.filter((_, i) => i !== index))
    }

    function updateTask(index: number, field: string, value: string | number | null) {
        setTasks(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t))
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        router.put(phases.update.url({ phase: phase.id }), {
            ...form,
            project_id: Number(form.project_id),
            order: Number(form.order) || 0,
            tasks: tasks.map(t => ({
                id: t.id || undefined,
                name: t.name,
                assigned_to: t.assigned_to ? Number(t.assigned_to) : null,
                priority: t.priority,
                status: t.status,
                start_date: t.start_date || null,
                end_date: t.end_date || null,
                description: t.description || null,
            })).filter(t => t.name),
        }, {
            preserveState: true, preserveScroll: true,
            onSuccess: () => { toast.success('Phase updated'); setSubmitting(false) },
            onError: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Edit Phase" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={phases.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Edit Phase</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Phase Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                                <Label htmlFor="project_id">Project</Label>
                                <select id="project_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} required>
                                    <option value="">Select project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="planning">Planning</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
                            </div>

                            <div className="col-span-2 border-t pt-4 mt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium">Tasks</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addTask}>
                                        <Plus className="mr-1 h-4 w-4" /> Add Task
                                    </Button>
                                </div>
                                {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks added yet.</p>}
                                {tasks.map((task, i) => (
                                    <div key={task.id || i} className="border rounded-md p-3 mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Task {i + 1}</span>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(i)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">Task Name</Label>
                                                <Input value={task.name} onChange={e => updateTask(i, 'name', e.target.value)} placeholder="Task name" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Assigned To</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={String(task.assigned_to || '')} onChange={e => updateTask(i, 'assigned_to', e.target.value ? Number(e.target.value) : null)}>
                                                    <option value="">Unassigned</option>
                                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Priority</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={task.priority} onChange={e => updateTask(i, 'priority', e.target.value)}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Status</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={task.status} onChange={e => updateTask(i, 'status', e.target.value)}>
                                                    <option value="todo">To Do</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Start Date</Label>
                                                <Input type="date" value={task.start_date || ''} onChange={e => updateTask(i, 'start_date', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label className="text-xs">End Date</Label>
                                                <Input type="date" value={task.end_date || ''} onChange={e => updateTask(i, 'end_date', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <Label className="text-xs">Description</Label>
                                            <Input value={task.description || ''} onChange={e => updateTask(i, 'description', e.target.value)} placeholder="Optional description" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-2 flex justify-end gap-2 pt-4">
                                <Link href={phases.index.url()}><Button variant="outline" type="button">Cancel</Button></Link>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Update'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Edit.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Phases', href: phases.index.url() },
        { title: 'Edit', href: phases.edit.url({ phase: props.phase.id }) },
    ],
})

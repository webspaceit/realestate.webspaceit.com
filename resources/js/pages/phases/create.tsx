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

interface TaskRow {
    _key: number
    name: string
    assigned_to: string
    priority: string
    status: string
    start_date: string
    end_date: string
    description: string
}

interface Props {
    projects: Project[]
    users: User[]
}

export default function Create() {
    const { projects, users } = usePage<Props>().props
    const [form, setForm] = useState({ project_id: '', name: '', description: '', start_date: '', end_date: '', status: 'planning', order: '' })
    const [tasks, setTasks] = useState<TaskRow[]>([])
    const [submitting, setSubmitting] = useState(false)
    let nextKey = 0

    function addTask() {
        setTasks(prev => [...prev, { _key: nextKey++, name: '', assigned_to: '', priority: 'medium', status: 'todo', start_date: '', end_date: '', description: '' }])
    }

    function removeTask(key: number) {
        setTasks(prev => prev.filter(t => t._key !== key))
    }

    function updateTask(key: number, field: string, value: string) {
        setTasks(prev => prev.map(t => t._key === key ? { ...t, [field]: value } : t))
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        router.post(phases.store.url(), {
            ...form,
            project_id: Number(form.project_id),
            order: Number(form.order) || 0,
            tasks: tasks.map(t => ({
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
            onSuccess: () => { toast.success('Phase created'); setSubmitting(false) },
            onError: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Create Phase" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={phases.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Create Phase</h1>
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
                                    <div key={task._key} className="border rounded-md p-3 mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Task {i + 1}</span>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(task._key)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">Task Name</Label>
                                                <Input value={task.name} onChange={e => updateTask(task._key, 'name', e.target.value)} placeholder="Task name" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Assigned To</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={task.assigned_to} onChange={e => updateTask(task._key, 'assigned_to', e.target.value)}>
                                                    <option value="">Unassigned</option>
                                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Priority</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={task.priority} onChange={e => updateTask(task._key, 'priority', e.target.value)}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Status</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={task.status} onChange={e => updateTask(task._key, 'status', e.target.value)}>
                                                    <option value="todo">To Do</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Start Date</Label>
                                                <Input type="date" value={task.start_date} onChange={e => updateTask(task._key, 'start_date', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label className="text-xs">End Date</Label>
                                                <Input type="date" value={task.end_date} onChange={e => updateTask(task._key, 'end_date', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <Label className="text-xs">Description</Label>
                                            <Input value={task.description} onChange={e => updateTask(task._key, 'description', e.target.value)} placeholder="Optional description" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-2 flex justify-end gap-2 pt-4">
                                <Link href={phases.index.url()}><Button variant="outline" type="button">Cancel</Button></Link>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Phases', href: phases.index.url() },
        { title: 'Create', href: phases.create.url() },
    ],
}

import { useState, FormEvent } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { dashboard } from '@/routes'
import tasks from '@/routes/tasks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Phase {
    id: number
    name: string
}

interface User {
    id: number
    name: string
    role: string
}

interface Props {
    phases: Phase[]
    users: User[]
}

export default function Create() {
    const { phases, users } = usePage<Props>().props
    const [form, setForm] = useState({ phase_id: '', name: '', description: '', assigned_to: '', assigned_to_role: '', start_date: '', end_date: '', status: 'todo', priority: 'medium' })
    const [submitting, setSubmitting] = useState(false)
    const filteredUsers = form.assigned_to_role ? users.filter(u => u.role === form.assigned_to_role) : users

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        router.post(tasks.store.url(), { ...form, phase_id: Number(form.phase_id), assigned_to: form.assigned_to ? Number(form.assigned_to) : null }, {
            preserveState: true, preserveScroll: true,
            onSuccess: () => { toast.success('Task created'); setSubmitting(false) },
            onError: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Create Task" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={tasks.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Create Task</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Task Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                                <Label htmlFor="phase_id">Phase</Label>
                                <select id="phase_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.phase_id} onChange={e => setForm({ ...form, phase_id: e.target.value })} required>
                                    <option value="">Select Phase...</option>
                                    {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="assigned_to_role">Role</Label>
                                <select id="assigned_to_role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.assigned_to_role} onChange={e => setForm({ ...form, assigned_to_role: e.target.value, assigned_to: '' })}>
                                    <option value="">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="staff">Staff</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="assigned_to">Assigned To</Label>
                                <select id="assigned_to" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
                                    <option value="">Unassigned</option>
                                    {filteredUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="priority">Priority</Label>
                                <select id="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
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
                            <div className="col-span-2 flex justify-end gap-2 pt-4">
                                <Link href={tasks.index.url()}><Button variant="outline" type="button">Cancel</Button></Link>
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
        { title: 'Tasks', href: tasks.index.url() },
        { title: 'Create', href: tasks.create.url() },
    ],
}

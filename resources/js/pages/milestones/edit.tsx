import { useState, FormEvent } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { dashboard } from '@/routes'
import milestones from '@/routes/milestones'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Project {
    id: number
    name: string
}

interface Milestone {
    id: number
    project_id: number
    name: string
    description: string
    due_date: string
    status: string
}

interface Props {
    milestone: Milestone
    projects: Project[]
}

export default function Edit() {
    const { milestone, projects } = usePage<Props>().props
    const [form, setForm] = useState({
        project_id: String(milestone.project_id),
        name: milestone.name,
        description: milestone.description || '',
        due_date: milestone.due_date || '',
        status: milestone.status,
    })
    const [submitting, setSubmitting] = useState(false)

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        router.put(milestones.update.url({ milestone: milestone.id }), { ...form, project_id: Number(form.project_id) }, {
            preserveState: true, preserveScroll: true,
            onSuccess: () => { toast.success('Milestone updated'); setSubmitting(false) },
            onError: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Edit Milestone" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={milestones.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Edit Milestone</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Milestone Details</CardTitle></CardHeader>
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
                                    <option value="pending">Pending</option>
                                    <option value="achieved">Achieved</option>
                                    <option value="missed">Missed</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input id="due_date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 pt-4">
                                <Link href={milestones.index.url()}><Button variant="outline" type="button">Cancel</Button></Link>
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
        { title: 'Milestones', href: milestones.index.url() },
        { title: 'Edit', href: milestones.edit.url({ milestone: props.milestone.id }) },
    ],
})

import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as budgetsIndex, update as budgetsUpdate } from '@/routes/budgets'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Project { id: number; name: string }
interface Phase { id: number; name: string }

interface Budget {
    id: number
    project: Project
    phase: Phase | null
    category: string
    amount: number
}

interface PageProps {
    budget: Budget
    projects: Project[]
    phases: Phase[]
}

export default function BudgetEdit() {
    const { budget, projects, phases } = usePage<PageProps>().props
    const [form, setForm] = useState({
        project_id: String(budget.project.id),
        phase_id: budget.phase ? String(budget.phase.id) : '',
        category: budget.category,
        amount: String(budget.amount),
    })
    const [processing, setProcessing] = useState(false)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.put(budgetsUpdate(budget.id).url, {
            project_id: form.project_id,
            phase_id: form.phase_id || undefined,
            category: form.category,
            amount: form.amount,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Budget updated'); setProcessing(false) },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <>
            <Head title="Edit Budget" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={budgetsIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Budget</h1>
                </div>

                <Card>
                    <CardHeader><CardTitle>Budget Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="project_id">Project</Label>
                                <Select value={form.project_id} onValueChange={v => setForm(f => ({ ...f, project_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select Project..." /></SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phase_id">Phase (optional)</Label>
                                <Select value={form.phase_id} onValueChange={v => setForm(f => ({ ...f, phase_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select Phase..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No phase</SelectItem>
                                        {phases.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <Link href={budgetsIndex()}><Button type="button" variant="outline">Cancel</Button></Link>
                                <Button type="submit" disabled={processing}>Update</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

BudgetEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Budgets', href: budgetsIndex() },
        { title: 'Edit', href: '#' },
    ],
}

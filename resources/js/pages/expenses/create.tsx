import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as expensesIndex, store as expensesStore } from '@/routes/expenses'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Project { id: number; name: string }
interface Phase { id: number; name: string }

interface PageProps {
    projects: Project[]
    phases: Phase[]
}

export default function ExpenseCreate() {
    const { projects, phases } = usePage<PageProps>().props
    const [form, setForm] = useState({
        project_id: '',
        phase_id: '',
        category: '',
        amount: '',
        description: '',
        expense_date: '',
        paid_to: '',
    })
    const [processing, setProcessing] = useState(false)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.post(expensesStore().url, {
            project_id: form.project_id,
            phase_id: form.phase_id || undefined,
            category: form.category,
            amount: form.amount,
            description: form.description,
            expense_date: form.expense_date,
            paid_to: form.paid_to,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Expense created'); setProcessing(false) },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <>
            <Head title="Create Expense" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={expensesIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Expense</h1>
                </div>

                <Card>
                    <CardHeader><CardTitle>Expense Details</CardTitle></CardHeader>
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
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expense_date">Expense Date</Label>
                                <Input id="expense_date" type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paid_to">Paid To</Label>
                                <Input id="paid_to" value={form.paid_to} onChange={e => setForm(f => ({ ...f, paid_to: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <Link href={expensesIndex()}><Button type="button" variant="outline">Cancel</Button></Link>
                                <Button type="submit" disabled={processing}>Create</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

ExpenseCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Expenses', href: expensesIndex() },
        { title: 'Create', href: expensesIndex().url + '/create' },
    ],
}

import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as expensesIndex, destroy as expensesDestroy } from '@/routes/expenses'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Project { id: number; name: string }
interface Phase { id: number; name: string }

interface Expense {
    id: number
    project: Project
    phase: Phase | null
    category: string
    amount: number
    description: string
    expense_date: string
    paid_to: string
}

interface PageProps {
    expenses: { data: Expense[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { project_id?: string; category?: string }
    projects: Project[]
}

export default function ExpensesIndex() {
    const { expenses, filters, projects } = usePage<PageProps>().props
    const [projectId, setProjectId] = useState(filters.project_id ?? '')
    const [category, setCategory] = useState(filters.category ?? '')

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        router.get(expensesIndex().url, { project_id: projectId || undefined, category: category || undefined }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this expense?')) return
        router.delete(expensesDestroy(id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Expense deleted') })
    }

    return (
        <>
            <Head title="Expenses" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <Link href={expensesIndex().url + '/create'}>
                        <Button><Plus className="mr-2 size-4" />Add Expense</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filter</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex items-end gap-4">
                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select value={projectId} onValueChange={setProjectId}>
                                    <SelectTrigger className="w-48"><SelectValue placeholder="All projects" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All projects</SelectItem>
                                        {projects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input placeholder="Filter by category" value={category} onChange={e => setCategory(e.target.value)} className="w-48" />
                            </div>
                            <Button type="submit"><Search className="mr-2 size-4" />Search</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Paid To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.data.map(e => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-medium">{e.project.name}</TableCell>
                                        <TableCell>{e.category}</TableCell>
                                        <TableCell>৳{Number(e.amount).toFixed(2)}</TableCell>
                                        <TableCell>{e.expense_date}</TableCell>
                                        <TableCell>{e.paid_to}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={expensesIndex().url + '/' + e.id}>
                                                    <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                                </Link>
                                                <Link href={expensesIndex().url + '/' + e.id + '/edit'}>
                                                    <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {expenses.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No expenses found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {expenses.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {expenses.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }) }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

ExpensesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Expenses', href: expensesIndex() },
    ],
}

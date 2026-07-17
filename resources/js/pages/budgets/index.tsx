import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as budgetsIndex, destroy as budgetsDestroy } from '@/routes/budgets'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Project { id: number; name: string }
interface Phase { id: number; name: string }

interface Budget {
    id: number
    project: Project
    phase: Phase | null
    category: string
    amount: number
    spent: number
    remaining: number
}

interface PageProps {
    budgets: { data: Budget[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { project_id?: string }
    projects: Project[]
}

export default function BudgetsIndex() {
    const { budgets, filters, projects } = usePage<PageProps>().props
    const [projectId, setProjectId] = useState(filters.project_id ?? '')

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        router.get(budgetsIndex().url, { project_id: projectId || undefined }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this budget?')) return
        router.delete(budgetsDestroy(id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Budget deleted') })
    }

    return (
        <>
            <Head title="Budgets" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Budgets</h1>
                    <Link href={budgetsIndex().url + '/create'}>
                        <Button><Plus className="mr-2 size-4" />Add Budget</Button>
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
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Spent</TableHead>
                                    <TableHead>Remaining</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budgets.data.map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">{b.project.name}</TableCell>
                                        <TableCell>{b.phase?.name ?? '-'}</TableCell>
                                        <TableCell>{b.category}</TableCell>
                                        <TableCell>৳{Number(b.amount).toFixed(2)}</TableCell>
                                        <TableCell>৳{Number(b.spent).toFixed(2)}</TableCell>
                                        <TableCell className={b.remaining < 0 ? 'text-red-600 font-medium' : ''}>
                                            ৳{Number(b.remaining).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={budgetsIndex().url + '/' + b.id}>
                                                    <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                                </Link>
                                                <Link href={budgetsIndex().url + '/' + b.id + '/edit'}>
                                                    <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {budgets.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No budgets found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {budgets.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {budgets.links.map((link, i) => (
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

BudgetsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Budgets', href: budgetsIndex() },
    ],
}

import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as budgetsIndex, destroy as budgetsDestroy } from '@/routes/budgets'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
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
    budget: Budget
}

export default function BudgetShow() {
    const { budget } = usePage<PageProps>().props

    function handleDelete() {
        if (!confirm('Are you sure you want to delete this budget?')) return
        router.delete(budgetsDestroy(budget.id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Budget deleted') })
    }

    return (
        <>
            <Head title={budget.category} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={budgetsIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{budget.category}</h1>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Details</CardTitle>
                        <div className="flex gap-2">
                            <Link href={budgetsIndex().url + '/' + budget.id + '/edit'}>
                                <Button variant="outline" size="sm"><Pencil className="mr-2 size-4" />Edit</Button>
                            </Link>
                            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 size-4" />Delete</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">Project</dt>
                                <dd className="font-medium">{budget.project.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Phase</dt>
                                <dd className="font-medium">{budget.phase?.name ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Category</dt>
                                <dd className="font-medium">{budget.category}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Amount</dt>
                                <dd className="font-medium">৳{Number(budget.amount).toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Spent</dt>
                                <dd className="font-medium">৳{Number(budget.spent).toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Remaining</dt>
                                <dd className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : ''}`}>
                                    ৳{Number(budget.remaining).toFixed(2)}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

BudgetShow.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Budgets', href: budgetsIndex() },
        { title: props.budget?.category ?? 'Detail', href: '#' },
    ],
})

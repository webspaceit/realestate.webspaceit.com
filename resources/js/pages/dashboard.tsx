import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Layers, FolderKanban, Users, AlertTriangle, type LucideIcon } from 'lucide-react'
import { dashboard } from '@/routes'

interface Expense {
    id: number
    description: string
    amount: number
    date: string
    category: string
}

interface InventoryItem {
    id: number
    name: string
    quantity: number
    reorder_level: number
    unit: string
}

interface Task {
    id: number
    title: string
    status: string
    priority: string
    due_date: string
}

interface Stats {
    total_buildings: number
    total_units: number
    total_projects: number
    total_clients: number
    total_contractors: number
    projects_by_status: {
        planning: number
        in_progress: number
        completed: number
        on_hold: number
    }
    recent_expenses: Expense[]
    low_stock: InventoryItem[]
    my_tasks: Task[]
}

interface PageProps {
    stats: Stats
}

function statusVariant(status: string) {
    switch (status) {
        case 'planning':
            return 'secondary'
        case 'in_progress':
            return 'default'
        case 'completed':
            return 'outline'
        case 'on_hold':
            return 'destructive'
        default:
            return 'secondary'
    }
}

function priorityVariant(priority: string) {
    switch (priority) {
        case 'high':
            return 'destructive'
        case 'medium':
            return 'default'
        case 'low':
            return 'secondary'
        default:
            return 'secondary'
    }
}

function StatCard({
    label,
    value,
    icon: Icon,
    gradient,
    shadow,
}: {
    label: string
    value: number
    icon: LucideIcon
    gradient: string
    shadow: string
}) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-xl ${shadow} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-6`}
        >
            <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/10"></div>
            <div className="absolute right-0 bottom-0 h-16 w-16 translate-x-5 translate-y-4 rounded-full bg-white/5"></div>
            <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-white/80 sm:text-sm">{label}</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { stats } = usePage<PageProps>().props

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Buildings"
                        value={stats.total_buildings}
                        icon={Building2}
                        gradient="from-primary-500 to-primary-700"
                        shadow="shadow-primary-500/20"
                    />
                    <StatCard
                        label="Total Flats"
                        value={stats.total_units}
                        icon={Layers}
                        gradient="from-teal-500 to-teal-700"
                        shadow="shadow-teal-500/20"
                    />
                    <StatCard
                        label="Total Projects"
                        value={stats.total_projects}
                        icon={FolderKanban}
                        gradient="from-indigo-500 to-indigo-700"
                        shadow="shadow-indigo-500/20"
                    />
                    <StatCard
                        label="Flat Owners Detail"
                        value={stats.total_clients}
                        icon={Users}
                        gradient="from-amber-500 to-orange-600"
                        shadow="shadow-amber-500/20"
                    />
                </div>

                {/* Projects by Status */}
                <Card className="overflow-hidden border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">
                            Projects by Status
                        </CardTitle>
                        <CardDescription>Overview of project statuses</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-700">
                                    {stats.projects_by_status.planning}
                                </span>
                                <span className="text-sm font-medium text-gray-700">Planning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 font-bold text-primary-700">
                                    {stats.projects_by_status.in_progress}
                                </span>
                                <span className="text-sm font-medium text-gray-700">In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-700">
                                    {stats.projects_by_status.completed}
                                </span>
                                <span className="text-sm font-medium text-gray-700">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 font-bold text-red-700">
                                    {stats.projects_by_status.on_hold}
                                </span>
                                <span className="text-sm font-medium text-gray-700">On Hold</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-hidden border-0 shadow-lg">
                        <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                            <CardTitle className="text-lg font-bold text-primary-700">
                                Recent Expenses
                            </CardTitle>
                            <CardDescription>Latest expense entries</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary-500 hover:bg-primary-500">
                                        <TableHead className="text-white">Description</TableHead>
                                        <TableHead className="text-white">Category</TableHead>
                                        <TableHead className="text-right text-white">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recent_expenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                                                No recent expenses.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        stats.recent_expenses.map((expense) => (
                                            <TableRow key={expense.id} className="border-gray-50 transition-colors hover:bg-primary-50/30">
                                                <TableCell className="font-medium text-gray-800">{expense.description}</TableCell>
                                                <TableCell className="text-gray-600">{expense.category}</TableCell>
                                                <TableCell className="text-right font-bold text-primary-600">
                                                    ৳{Number(expense.amount).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-0 shadow-lg">
                        <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                            <CardTitle className="text-lg font-bold text-primary-700">
                                My Tasks
                            </CardTitle>
                            <CardDescription>Upcoming and pending tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary-500 hover:bg-primary-500">
                                        <TableHead className="text-white">Task</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Priority</TableHead>
                                        <TableHead className="text-white">Due</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.my_tasks.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                                                No tasks assigned.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        stats.my_tasks.map((task) => (
                                            <TableRow key={task.id} className="border-gray-50 transition-colors hover:bg-primary-50/30">
                                                <TableCell className="font-medium text-gray-800">{task.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={priorityVariant(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{new Date(task.due_date).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Card className="overflow-hidden border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-2 rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                            <CardTitle className="text-lg font-bold text-primary-700">
                                Low Stock Inventory
                            </CardTitle>
                            <CardDescription>Items that need reordering</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {stats.low_stock.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">All inventory items are adequately stocked.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.low_stock.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-primary-100 bg-gradient-to-r from-primary-50/50 to-white p-3 transition-all hover:shadow-md">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} / {item.reorder_level} {item.unit}
                                            </p>
                                        </div>
                                        <Badge variant="destructive">
                                            {item.quantity} left
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
}
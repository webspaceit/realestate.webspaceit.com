import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Layers, FolderKanban, Users, AlertTriangle } from 'lucide-react'
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

export default function Dashboard() {
    const { stats } = usePage<PageProps>().props

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Buildings</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_buildings}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_units}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_projects}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Flat Owners Detail</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_clients}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Projects by Status</CardTitle>
                        <CardDescription>Overview of project statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{stats.projects_by_status.planning}</Badge>
                                <span className="text-sm text-muted-foreground">Planning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge>{stats.projects_by_status.in_progress}</Badge>
                                <span className="text-sm text-muted-foreground">In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{stats.projects_by_status.completed}</Badge>
                                <span className="text-sm text-muted-foreground">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="destructive">{stats.projects_by_status.on_hold}</Badge>
                                <span className="text-sm text-muted-foreground">On Hold</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                            <CardDescription>Latest expense entries</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
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
                                            <TableRow key={expense.id}>
                                                <TableCell className="font-medium">{expense.description}</TableCell>
                                                <TableCell>{expense.category}</TableCell>
                                                <TableCell className="text-right">
                                                    ৳{Number(expense.amount).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                            <CardDescription>Upcoming and pending tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Due</TableHead>
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
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={priorityVariant(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                            <CardTitle>Low Stock Inventory</CardTitle>
                            <CardDescription>Items that need reordering</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.low_stock.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">All inventory items are adequately stocked.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.low_stock.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
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

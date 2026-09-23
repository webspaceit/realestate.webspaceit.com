import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChartSvg, AreaChartSvg, DonutChartSvg } from '@/components/ui/mini-charts'
import { Building2, Layers, FolderKanban, Users, AlertTriangle, type LucideIcon } from 'lucide-react'
import { dashboard } from '@/routes'
import { fmtDate } from '@/lib/utils'

interface Expense { id: number; description: string; amount: number; date: string; category: string }
interface InventoryItem { id: number; name: string; quantity: number; reorder_level: number; unit: string }
interface Task { id: number; title: string; status: string; priority: string; due_date: string }
interface UnitStatus { status: string; count: number }
interface MonthlyExp { month: string; total: number }

interface Stats {
    total_buildings: number
    total_units: number
    total_projects: number
    total_clients: number
    total_contractors: number
    projects_by_status: { planning: number; in_progress: number; completed: number; on_hold: number }
    recent_expenses: Expense[]
    low_stock: InventoryItem[]
    my_tasks: Task[]
    units_by_status: UnitStatus[]
    monthly_expenses: MonthlyExp[]
}

function statusVariant(s: string) {
    return ({ planning: 'secondary', in_progress: 'default', completed: 'outline', on_hold: 'destructive' } as any)[s] ?? 'secondary'
}
function priorityVariant(p: string) {
    return ({ high: 'destructive', medium: 'default', low: 'secondary' } as any)[p] ?? 'secondary'
}

function StatCard({ label, value, icon: Icon, gradient, shadow }: {
    label: string; value: number; icon: LucideIcon; gradient: string; shadow: string
}) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-xl ${shadow} transition-all duration-300 hover:scale-[1.02] sm:p-6`}>
            <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/10" />
            <div className="absolute right-0 bottom-0 h-16 w-16 translate-x-5 translate-y-4 rounded-full bg-white/5" />
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

const PROJECT_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444']
const UNIT_COLORS: Record<string, string> = { Available: '#14b8a6', Reserved: '#f59e0b', Sold: '#6366f1' }

export default function Dashboard() {
    const { stats } = usePage<{ stats: Stats }>().props

    const projectPie = [
        { label: 'Planning', value: stats.projects_by_status.planning, color: PROJECT_COLORS[0] },
        { label: 'In Progress', value: stats.projects_by_status.in_progress, color: PROJECT_COLORS[1] },
        { label: 'Completed', value: stats.projects_by_status.completed, color: PROJECT_COLORS[2] },
        { label: 'On Hold', value: stats.projects_by_status.on_hold, color: PROJECT_COLORS[3] },
    ].filter(d => d.value > 0)

    const unitBars = stats.units_by_status.map(u => ({
        label: u.status,
        value: u.count,
        color: UNIT_COLORS[u.status] ?? '#6366f1',
    }))

    const expArea = stats.monthly_expenses.map(e => ({
        label: e.month,
        value: e.total,
    }))

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">

                {/* KPI Cards */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Buildings" value={stats.total_buildings} icon={Building2} gradient="from-indigo-500 to-indigo-700" shadow="shadow-indigo-500/20" />
                    <StatCard label="Total Flats" value={stats.total_units} icon={Layers} gradient="from-teal-500 to-teal-700" shadow="shadow-teal-500/20" />
                    <StatCard label="Total Projects" value={stats.total_projects} icon={FolderKanban} gradient="from-violet-500 to-purple-700" shadow="shadow-violet-500/20" />
                    <StatCard label="Flat Owners" value={stats.total_clients} icon={Users} gradient="from-amber-500 to-orange-600" shadow="shadow-amber-500/20" />
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects by Status</CardTitle>
                            <CardDescription>Distribution across all projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutChartSvg data={projectPie} size={160} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Units by Status</CardTitle>
                            <CardDescription>Available, reserved & sold</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChartSvg data={unitBars} height={180} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Expenses</CardTitle>
                            <CardDescription>Last 12 months spend</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AreaChartSvg data={expArea} height={180} prefix="৳" color="#6366f1" />
                        </CardContent>
                    </Card>
                </div>

                {/* Tables */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b">
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
                                        <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No recent expenses.</TableCell></TableRow>
                                    ) : stats.recent_expenses.map(e => (
                                        <TableRow key={e.id}>
                                            <TableCell className="font-medium">{e.description}</TableCell>
                                            <TableCell className="text-muted-foreground">{e.category}</TableCell>
                                            <TableCell className="text-right font-semibold">৳{Number(e.amount).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <CardHeader className="border-b">
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
                                        <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No tasks assigned.</TableCell></TableRow>
                                    ) : stats.my_tasks.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium">{t.title}</TableCell>
                                            <TableCell><Badge variant={statusVariant(t.status)}>{t.status}</Badge></TableCell>
                                            <TableCell><Badge variant={priorityVariant(t.priority)}>{t.priority}</Badge></TableCell>
                                            <TableCell className="text-muted-foreground">{fmtDate(t.due_date)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-2 border-b">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                            <CardTitle>Low Stock Inventory</CardTitle>
                            <CardDescription>Items that need reordering</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {stats.low_stock.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">All inventory items are adequately stocked.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.low_stock.map(item => (
                                    <div key={item.id} className="flex items-center justify-between rounded-xl border p-3">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.quantity} / {item.reorder_level} {item.unit}</p>
                                        </div>
                                        <Badge variant="destructive">{item.quantity} left</Badge>
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
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
}

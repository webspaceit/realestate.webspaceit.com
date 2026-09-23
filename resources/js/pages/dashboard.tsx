import { Head, usePage } from '@inertiajs/react'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Layers, FolderKanban, Users, AlertTriangle, type LucideIcon } from 'lucide-react'
import { dashboard } from '@/routes'
import { fmtDate } from '@/lib/utils'

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

interface UnitStatus {
    status: string
    count: number
}

interface MonthlyExpense {
    month: string
    total: number
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
    units_by_status: UnitStatus[]
    monthly_expenses: MonthlyExpense[]
}

interface PageProps {
    stats: Stats
}

// ── Colour palette ────────────────────────────────────────────────────────────
const PROJECT_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444']
const UNIT_COLORS: Record<string, string> = {
    Available: '#14b8a6',
    Reserved: '#f59e0b',
    Sold: '#6366f1',
}
const CHART_STROKE = '#6366f1'
const CHART_FILL = '#6366f1'

function statusVariant(status: string) {
    switch (status) {
        case 'planning': return 'secondary' as const
        case 'in_progress': return 'default' as const
        case 'completed': return 'outline' as const
        case 'on_hold': return 'destructive' as const
        default: return 'secondary' as const
    }
}

function priorityVariant(priority: string) {
    switch (priority) {
        case 'high': return 'destructive' as const
        case 'medium': return 'default' as const
        case 'low': return 'secondary' as const
        default: return 'secondary' as const
    }
}

function StatCard({ label, value, icon: Icon, gradient, shadow }: {
    label: string; value: number; icon: LucideIcon; gradient: string; shadow: string
}) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-xl ${shadow} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-6`}>
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

// Custom tooltip shared by area / bar charts
function ChartTooltip({ active, payload, label, prefix = '' }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
            <p className="mb-1 font-medium text-muted-foreground">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {prefix}{Number(p.value).toLocaleString('en-US')}
                </p>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const { stats } = usePage<PageProps>().props

    const projectPieData = [
        { name: 'Planning', value: stats.projects_by_status.planning },
        { name: 'In Progress', value: stats.projects_by_status.in_progress },
        { name: 'Completed', value: stats.projects_by_status.completed },
        { name: 'On Hold', value: stats.projects_by_status.on_hold },
    ].filter(d => d.value > 0)

    const hasExpenses = stats.monthly_expenses.length > 0
    const hasUnits = stats.units_by_status.length > 0
    const hasProjects = projectPieData.length > 0

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">

                {/* ── KPI Cards ── */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Buildings" value={stats.total_buildings} icon={Building2} gradient="from-indigo-500 to-indigo-700" shadow="shadow-indigo-500/20" />
                    <StatCard label="Total Flats" value={stats.total_units} icon={Layers} gradient="from-teal-500 to-teal-700" shadow="shadow-teal-500/20" />
                    <StatCard label="Total Projects" value={stats.total_projects} icon={FolderKanban} gradient="from-violet-500 to-purple-700" shadow="shadow-violet-500/20" />
                    <StatCard label="Flat Owners Detail" value={stats.total_clients} icon={Users} gradient="from-amber-500 to-orange-600" shadow="shadow-amber-500/20" />
                </div>

                {/* ── Charts row ── */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Projects by Status — Donut */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects by Status</CardTitle>
                            <CardDescription>Distribution across all projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!hasProjects ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">No projects yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={projectPieData}
                                            cx="50%" cy="50%"
                                            innerRadius={55} outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                            labelLine={false}
                                        >
                                            {projectPieData.map((_, i) => (
                                                <Cell key={i} fill={PROJECT_COLORS[i % PROJECT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip />} />
                                        <Legend iconType="circle" iconSize={8} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Units by Status — Bar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Units by Status</CardTitle>
                            <CardDescription>Available, reserved, and sold units</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!hasUnits ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">No units yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={stats.units_by_status} barSize={40}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="status" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar dataKey="count" name="Units" radius={[6, 6, 0, 0]}>
                                            {stats.units_by_status.map((entry, i) => (
                                                <Cell key={i} fill={UNIT_COLORS[entry.status] ?? CHART_FILL} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Expenses — Area */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Expenses</CardTitle>
                            <CardDescription>Last 12 months spend</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!hasExpenses ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">No expense data yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <AreaChart data={stats.monthly_expenses}>
                                        <defs>
                                            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_STROKE} stopOpacity={0.25} />
                                                <stop offset="95%" stopColor={CHART_STROKE} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                                            tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<ChartTooltip prefix="৳" />} />
                                        <Area type="monotone" dataKey="total" name="Expenses"
                                            stroke={CHART_STROKE} strokeWidth={2}
                                            fill="url(#expGrad)" dot={{ r: 3, fill: CHART_STROKE }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Tables row ── */}
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
                                    ) : stats.recent_expenses.map((e) => (
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
                                    ) : stats.my_tasks.map((t) => (
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

                {/* ── Low Stock ── */}
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
                                {stats.low_stock.map((item) => (
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

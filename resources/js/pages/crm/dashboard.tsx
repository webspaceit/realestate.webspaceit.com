import { Head, Link, usePage } from '@inertiajs/react'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Handshake, Target, TrendingUp, PhoneCall, CalendarDays, type LucideIcon } from 'lucide-react'
import { dashboard } from '@/routes'
import leads from '@/routes/leads'
import interactions from '@/routes/interactions'
import meetings from '@/routes/meetings'

interface Stage {
    stage: string
    badge: string
    probability: number
    count: number
    value: number
    weighted: number
}

interface FollowUp {
    id: number
    contact_person: string
    company_name: string | null
    stage: string
    follow_up_date: string
}

interface UpcomingMeeting {
    id: number
    title: string
    location: string | null
    status: string
    scheduled_at: string
    lead: string | null
    client: string | null
}

interface RecentInteraction {
    id: number
    type: string
    subject: string
    interaction_date: string
    party: string | null
}

interface MonthlyLead { month: string; count: number }
interface InteractionType { type: string; count: number }

interface Stats {
    total_leads: number
    open_leads: number
    pipeline_value: number
    weighted_value: number
    awarded_value: number
    meetings_upcoming: number
}

interface PageProps {
    stats: Stats
    byStage: Stage[]
    upcomingFollowUps: FollowUp[]
    upcomingMeetings: UpcomingMeeting[]
    recentInteractions: RecentInteraction[]
    monthlyLeads: MonthlyLead[]
    interactionsByType: InteractionType[]
}

// ── Colours ───────────────────────────────────────────────────────────────────
const STAGE_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#f97316']
const TYPE_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6']
const LEAD_COLOR = '#6366f1'

function fmt(n: number) {
    return `৳${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

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

function StatCard({ label, value, icon: Icon, gradient, shadow }: {
    label: string; value: string | number; icon: LucideIcon; gradient: string; shadow: string
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-xl ${shadow} transition-all hover:scale-[1.02] sm:p-6`}>
            <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/10" />
            <div className="absolute right-0 bottom-0 h-16 w-16 translate-x-5 translate-y-4 rounded-full bg-white/5" />
            <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-white/80 sm:text-sm">{label}</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
            </div>
        </div>
    )
}

function stageBadgeVariant(stage: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (stage === 'Awarded' || stage === 'On Hold') return 'outline'
    if (stage === 'Lost') return 'destructive'
    if (stage === 'Proposal / BOQ' || stage === 'Negotiation') return 'default'
    return 'secondary'
}

export default function CrmDashboard() {
    const {
        stats, byStage, upcomingFollowUps, upcomingMeetings, recentInteractions,
        monthlyLeads, interactionsByType,
    } = usePage<PageProps>().props

    // Pipeline bar data — only stages with leads
    const pipelineChartData = byStage
        .filter(s => s.count > 0)
        .map(s => ({ stage: s.stage, Value: s.value, Weighted: s.weighted }))

    return (
        <>
            <Head title="CRM Dashboard" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">CRM Dashboard</h1>
                <div className="flex gap-2">
                    <Link href={leads.create().url} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90">
                        <Target className="h-4 w-4" />New Lead
                    </Link>
                    <Link href={interactions.create().url} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent">
                        <PhoneCall className="h-4 w-4" />Log Interaction
                    </Link>
                    <Link href={meetings.create().url} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent">
                        <CalendarDays className="h-4 w-4" />Schedule Meeting
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Total Leads" value={stats.total_leads} icon={Handshake} gradient="from-emerald-500 to-teal-600" shadow="shadow-emerald-500/20" />
                <StatCard label="Open Leads" value={stats.open_leads} icon={Target} gradient="from-blue-500 to-indigo-600" shadow="shadow-blue-500/20" />
                <StatCard label="Pipeline Value" value={fmt(stats.pipeline_value)} icon={TrendingUp} gradient="from-orange-500 to-amber-600" shadow="shadow-orange-500/20" />
                <StatCard label="Weighted Pipeline" value={fmt(stats.weighted_value)} icon={TrendingUp} gradient="from-purple-500 to-fuchsia-600" shadow="shadow-purple-500/20" />
                <StatCard label="Awarded Value" value={fmt(stats.awarded_value)} icon={TrendingUp} gradient="from-green-500 to-lime-600" shadow="shadow-green-500/20" />
                <StatCard label="Upcoming Meetings" value={stats.meetings_upcoming} icon={CalendarDays} gradient="from-rose-500 to-pink-600" shadow="shadow-rose-500/20" />
            </div>

            {/* ── Charts row ── */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Pipeline Bar Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Deal value vs weighted value per stage (৳)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pipelineChartData.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">No active pipeline data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={pipelineChartData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                                        tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip content={<ChartTooltip prefix="৳" />} />
                                    <Legend iconType="circle" iconSize={8} />
                                    <Bar dataKey="Value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Weighted" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Interactions by Type — Donut */}
                <Card>
                    <CardHeader>
                        <CardTitle>Interactions by Type</CardTitle>
                        <CardDescription>All-time breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {interactionsByType.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">No interactions yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={interactionsByType}
                                        dataKey="count"
                                        nameKey="type"
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={85}
                                        paddingAngle={3}
                                        label={({ type, count }) => `${type}: ${count}`}
                                        labelLine={false}
                                    >
                                        {interactionsByType.map((_, i) => (
                                            <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                    <Legend iconType="circle" iconSize={8} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Leads Area Chart */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Monthly Leads (Last 12 Months)</CardTitle>
                    <CardDescription>New leads created per month</CardDescription>
                </CardHeader>
                <CardContent>
                    {monthlyLeads.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No lead data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={monthlyLeads}>
                                <defs>
                                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={LEAD_COLOR} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={LEAD_COLOR} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area type="monotone" dataKey="count" name="Leads"
                                    stroke={LEAD_COLOR} strokeWidth={2}
                                    fill="url(#leadGrad)" dot={{ r: 3, fill: LEAD_COLOR }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* ── Pipeline table + side panels ── */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Open deals — weighted value = value × probability</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stage</TableHead>
                                    <TableHead className="text-right">Deals</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead className="text-right">Weighted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {byStage.map((s) => (
                                    <TableRow key={s.stage}>
                                        <TableCell>
                                            <Badge variant={stageBadgeVariant(s.stage)}>{s.stage}</Badge>
                                            <span className="ml-2 text-xs text-muted-foreground">{s.probability}%</span>
                                        </TableCell>
                                        <TableCell className="text-right">{s.count}</TableCell>
                                        <TableCell className="text-right">{s.count > 0 ? fmt(s.value) : '—'}</TableCell>
                                        <TableCell className="text-right">{s.count > 0 ? fmt(s.weighted) : '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Upcoming Follow-ups</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {upcomingFollowUps.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming follow-ups.</p>
                            ) : upcomingFollowUps.map((f) => (
                                <Link key={f.id} href={leads.show(f.id).url} className="block rounded-lg border p-3 hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{f.contact_person}</span>
                                        <Badge variant="secondary">{f.follow_up_date}</Badge>
                                    </div>
                                    {f.company_name && <p className="mt-0.5 text-xs text-muted-foreground">{f.company_name}</p>}
                                    <p className="mt-1 text-xs text-muted-foreground">{f.stage}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Upcoming Meetings</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {upcomingMeetings.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming meetings.</p>
                            ) : upcomingMeetings.map((m) => (
                                <Link key={m.id} href={meetings.edit(m.id).url} className="block rounded-lg border p-3 hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{m.title}</span>
                                        <Badge variant="secondary">{m.scheduled_at}</Badge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{m.lead || m.client || m.location || ''}</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Recent Interactions ── */}
            <Card>
                <CardHeader><CardTitle>Recent Interactions</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Party</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentInteractions.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No interactions yet.</TableCell></TableRow>
                            ) : recentInteractions.map((i) => (
                                <TableRow key={i.id}>
                                    <TableCell><Badge variant="secondary">{i.type}</Badge></TableCell>
                                    <TableCell className="font-medium">{i.subject}</TableCell>
                                    <TableCell>{i.party || '—'}</TableCell>
                                    <TableCell className="text-muted-foreground">{i.interaction_date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

CrmDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'CRM Dashboard', href: '/crm' },
    ],
}

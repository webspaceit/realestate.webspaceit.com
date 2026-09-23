import { Head, Link, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChartSvg, AreaChartSvg, DonutChartSvg } from '@/components/ui/mini-charts'
import { Handshake, Target, TrendingUp, PhoneCall, CalendarDays, type LucideIcon } from 'lucide-react'
import { dashboard } from '@/routes'
import leads from '@/routes/leads'
import interactions from '@/routes/interactions'
import meetings from '@/routes/meetings'

interface Stage { stage: string; badge: string; probability: number; count: number; value: number; weighted: number }
interface FollowUp { id: number; contact_person: string; company_name: string | null; stage: string; follow_up_date: string }
interface UpcomingMeeting { id: number; title: string; location: string | null; status: string; scheduled_at: string; lead: string | null; client: string | null }
interface RecentInteraction { id: number; type: string; subject: string; interaction_date: string; party: string | null }
interface MonthlyLead { month: string; count: number }
interface InteractionType { type: string; count: number }

interface Stats {
    total_leads: number; open_leads: number; pipeline_value: number
    weighted_value: number; awarded_value: number; meetings_upcoming: number
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

const TYPE_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6']
const STAGE_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#f97316']

function fmt(n: number) {
    return `৳${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function StatCard({ label, value, icon: Icon, gradient, shadow }: {
    label: string; value: string | number; icon: LucideIcon; gradient: string; shadow: string
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-xl ${shadow} transition-all hover:scale-[1.02] sm:p-5`}>
            <div className="absolute top-0 right-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-white/10" />
            <div className="relative">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-white/80">{label}</p>
                <p className="mt-0.5 text-xl font-bold sm:text-2xl">{value}</p>
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

    const pipelineBars = byStage
        .filter(s => s.count > 0)
        .map(s => ({ label: s.stage, value: s.value, value2: s.weighted }))

    const leadArea = monthlyLeads.map(m => ({ label: m.month, value: m.count }))

    const interactionPie = interactionsByType.map((t, i) => ({
        label: t.type,
        value: t.count,
        color: TYPE_COLORS[i % TYPE_COLORS.length],
    }))

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

            {/* KPI Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Total Leads" value={stats.total_leads} icon={Handshake} gradient="from-emerald-500 to-teal-600" shadow="shadow-emerald-500/20" />
                <StatCard label="Open Leads" value={stats.open_leads} icon={Target} gradient="from-blue-500 to-indigo-600" shadow="shadow-blue-500/20" />
                <StatCard label="Pipeline Value" value={fmt(stats.pipeline_value)} icon={TrendingUp} gradient="from-orange-500 to-amber-600" shadow="shadow-orange-500/20" />
                <StatCard label="Weighted" value={fmt(stats.weighted_value)} icon={TrendingUp} gradient="from-purple-500 to-fuchsia-600" shadow="shadow-purple-500/20" />
                <StatCard label="Awarded" value={fmt(stats.awarded_value)} icon={TrendingUp} gradient="from-green-500 to-lime-600" shadow="shadow-green-500/20" />
                <StatCard label="Meetings" value={stats.meetings_upcoming} icon={CalendarDays} gradient="from-rose-500 to-pink-600" shadow="shadow-rose-500/20" />
            </div>

            {/* Charts row */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Value vs Weighted Value (৳)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChartSvg data={pipelineBars} height={220} prefix="৳" color="#6366f1" color2="#14b8a6" label2="Weighted" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Interactions by Type</CardTitle>
                        <CardDescription>All-time breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DonutChartSvg data={interactionPie} size={160} />
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Leads */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Monthly Leads — Last 12 Months</CardTitle>
                    <CardDescription>New leads created per month</CardDescription>
                </CardHeader>
                <CardContent>
                    <AreaChartSvg data={leadArea} height={180} color="#6366f1" />
                </CardContent>
            </Card>

            {/* Pipeline table + side panels */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Weighted value = value × probability</CardDescription>
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
                                {byStage.map(s => (
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
                            ) : upcomingFollowUps.map(f => (
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
                            ) : upcomingMeetings.map(m => (
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

            {/* Recent Interactions */}
            <Card>
                <CardHeader><CardTitle>Recent Interactions</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead><TableHead>Subject</TableHead>
                                <TableHead>Party</TableHead><TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentInteractions.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No interactions yet.</TableCell></TableRow>
                            ) : recentInteractions.map(i => (
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

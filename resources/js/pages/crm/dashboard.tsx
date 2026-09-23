import { Head, Link, usePage } from '@inertiajs/react'
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
}

function formatMoney(value: number) {
    return `৳${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function StatCard({
    label,
    value,
    icon: Icon,
    gradient,
    shadow,
}: {
    label: string
    value: string | number
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

function stageBadgeVariant(stage: string) {
    switch (stage) {
        case 'Awarded':
            return 'outline'
        case 'Lost':
            return 'destructive'
        case 'On Hold':
            return 'outline'
        case 'Proposal / BOQ':
        case 'Negotiation':
            return 'default'
        default:
            return 'secondary'
    }
}

export default function CrmDashboard() {
    const { stats, byStage, upcomingFollowUps, upcomingMeetings, recentInteractions } = usePage<PageProps>().props

    return (
        <>
            <Head title="CRM Dashboard" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">CRM Dashboard</h1>
                <div className="flex gap-2">
                    <Link href={leads.create()} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90">
                        <Target className="h-4 w-4" />
                        New Lead
                    </Link>
                    <Link href={interactions.create()} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
                        <PhoneCall className="h-4 w-4" />
                        Log Interaction
                    </Link>
                    <Link href={meetings.create()} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
                        <CalendarDays className="h-4 w-4" />
                        Schedule Meeting
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Leads" value={stats.total_leads} icon={Handshake} gradient="from-emerald-500 to-teal-600" shadow="shadow-emerald-500/20" />
                <StatCard label="Open Opportunities" value={stats.open_leads} icon={Target} gradient="from-blue-500 to-indigo-600" shadow="shadow-blue-500/20" />
                <StatCard label="Pipeline Value" value={formatMoney(stats.pipeline_value)} icon={TrendingUp} gradient="from-orange-500 to-amber-600" shadow="shadow-orange-500/20" />
                <StatCard label="Weighted Pipeline" value={formatMoney(stats.weighted_value)} icon={TrendingUp} gradient="from-purple-500 to-fuchsia-600" shadow="shadow-purple-500/20" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Open deals across the sales pipeline (weighted value = value × probability)</CardDescription>
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
                                {byStage.map((s: Stage) => (
                                    <TableRow key={s.stage}>
                                        <TableCell>
                                            <Badge variant={(stageBadgeVariant(s.stage) as 'default' | 'secondary' | 'outline' | 'destructive')}>{s.stage}</Badge>
                                            <span className="ml-2 text-xs text-muted-foreground">{s.probability}%</span>
                                        </TableCell>
                                        <TableCell className="text-right">{s.count}</TableCell>
                                        <TableCell className="text-right">{s.count > 0 ? formatMoney(s.value) : '—'}</TableCell>
                                        <TableCell className="text-right">{s.count > 0 ? formatMoney(s.weighted) : '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Follow-ups</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {upcomingFollowUps.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming follow-ups.</p>
                            ) : (
                                upcomingFollowUps.map((f) => (
                                    <Link key={f.id} href={leads.show(f.id).url} className="block rounded-lg border p-3 transition-colors hover:bg-accent">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{f.contact_person}</span>
                                            <Badge variant="secondary">{f.follow_up_date}</Badge>
                                        </div>
                                        {f.company_name && <p className="mt-0.5 text-xs text-muted-foreground">{f.company_name}</p>}
                                        <p className="mt-1 text-xs text-muted-foreground">{f.stage}</p>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Meetings & Site Visits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {upcomingMeetings.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming meetings.</p>
                            ) : (
                                upcomingMeetings.map((m) => (
                                    <Link key={m.id} href={meetings.edit(m.id).url} className="block rounded-lg border p-3 transition-colors hover:bg-accent">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{m.title}</span>
                                            <Badge variant="secondary">{m.scheduled_at}</Badge>
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{m.lead || m.client || m.location || ''}</p>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Interactions</CardTitle>
                    </CardHeader>
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
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No interactions logged yet.</TableCell>
                                    </TableRow>
                                ) : (
                                    recentInteractions.map((i) => (
                                        <TableRow key={i.id}>
                                            <TableCell>
                                                <Badge variant="secondary">{i.type}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{i.subject}</TableCell>
                                            <TableCell>{i.party || '—'}</TableCell>
                                            <TableCell className="text-muted-foreground">{i.interaction_date}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

CrmDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'CRM Dashboard', href: '/crm' },
    ],
}
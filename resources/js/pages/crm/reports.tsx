import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, Users, Target, CalendarCheck, PhoneCall, BarChart3 } from 'lucide-react'
import { dashboard } from '@/routes'
import crm from '@/routes/crm'

interface StageRow   { stage: string; count: number; value: number; badge: string }
interface SourceRow  { source: string; count: number }
interface MonthlyRow { month: string; count: number; value?: string }
interface TypeRow    { type: string; count: number }
interface ClientRow  { id: number; name: string; total_value: number }

interface ConversionStats {
    total: number
    converted: number
    awarded: number
    lost: number
    conversion_rate: number
}

interface BookingsByStatus {
    pending: number
    confirmed: number
    cancelled: number
}

interface PageProps {
    byStage: StageRow[]
    bySource: SourceRow[]
    monthlyLeads: MonthlyRow[]
    monthlyBookings: MonthlyRow[]
    conversionStats: ConversionStats
    bookingsByStatus: BookingsByStatus
    totalBookingValue: number
    interactionsByType: TypeRow[]
    topClients: ClientRow[]
}

function fmt(n: number) {
    return `৳${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: typeof TrendingUp; color: string }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-lg`}>
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="relative">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-white/80">{label}</p>
                <p className="mt-0.5 text-2xl font-bold">{value}</p>
                {sub && <p className="mt-0.5 text-xs text-white/70">{sub}</p>}
            </div>
        </div>
    )
}

function stageBadge(badge: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (badge === 'destructive') return 'destructive'
    if (badge === 'outline') return 'outline'
    if (badge === 'default') return 'default'
    return 'secondary'
}

export default function Reports() {
    const {
        byStage, bySource, monthlyLeads, monthlyBookings,
        conversionStats, bookingsByStatus, totalBookingValue,
        interactionsByType, topClients,
    } = usePage<PageProps>().props

    const totalLeadValue = byStage.reduce((s, r) => s + r.value, 0)

    return (
        <>
            <Head title="CRM Reports" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">CRM Reports</h1>
                <span className="text-sm text-muted-foreground">All-time data</span>
            </div>

            {/* KPI row */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Total Leads"     value={conversionStats.total}        icon={Target}        color="from-blue-500 to-indigo-600" />
                <StatCard label="Converted"        value={conversionStats.converted}    sub={`${conversionStats.conversion_rate}% rate`} icon={Users} color="from-emerald-500 to-teal-600" />
                <StatCard label="Awarded"          value={conversionStats.awarded}      icon={TrendingUp}    color="from-green-500 to-lime-600" />
                <StatCard label="Lost"             value={conversionStats.lost}         icon={BarChart3}     color="from-red-500 to-rose-600" />
                <StatCard label="Confirmed Bookings" value={bookingsByStatus.confirmed} icon={CalendarCheck} color="from-orange-500 to-amber-600" />
                <StatCard label="Booking Value"   value={fmt(totalBookingValue)}        icon={TrendingUp}    color="from-purple-500 to-fuchsia-600" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                {/* Pipeline by Stage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline by Stage</CardTitle>
                        <CardDescription>Lead count and total value per stage</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stage</TableHead>
                                    <TableHead className="text-right">Leads</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead className="text-right">Share</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {byStage.map((r) => (
                                    <TableRow key={r.stage}>
                                        <TableCell><Badge variant={stageBadge(r.badge)}>{r.stage}</Badge></TableCell>
                                        <TableCell className="text-right">{r.count}</TableCell>
                                        <TableCell className="text-right">{r.value > 0 ? fmt(r.value) : '—'}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {totalLeadValue > 0 && r.value > 0 ? `${Math.round(r.value / totalLeadValue * 100)}%` : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Leads by Source */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leads by Source</CardTitle>
                        <CardDescription>How leads are finding you</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="text-right">Leads</TableHead>
                                    <TableHead className="text-right">Share</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bySource.length === 0 ? (
                                    <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No data yet.</TableCell></TableRow>
                                ) : bySource.map((r) => (
                                    <TableRow key={r.source}>
                                        <TableCell className="font-medium">{r.source}</TableCell>
                                        <TableCell className="text-right">{r.count}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {conversionStats.total > 0 ? `${Math.round(r.count / conversionStats.total * 100)}%` : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Monthly Leads */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Leads (Last 12 Months)</CardTitle>
                        <CardDescription>New leads created per month</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Leads</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyLeads.length === 0 ? (
                                    <TableRow><TableCell colSpan={2} className="py-6 text-center text-muted-foreground">No data yet.</TableCell></TableRow>
                                ) : monthlyLeads.map((r) => (
                                    <TableRow key={r.month}>
                                        <TableCell>{r.month}</TableCell>
                                        <TableCell className="text-right font-medium">{r.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Monthly Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Bookings (Last 12 Months)</CardTitle>
                        <CardDescription>Bookings and value per month</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Bookings</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyBookings.length === 0 ? (
                                    <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No data yet.</TableCell></TableRow>
                                ) : monthlyBookings.map((r) => (
                                    <TableRow key={r.month}>
                                        <TableCell>{r.month}</TableCell>
                                        <TableCell className="text-right font-medium">{r.count}</TableCell>
                                        <TableCell className="text-right">{r.value ? fmt(Number(r.value)) : '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Booking status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {([['pending', bookingsByStatus.pending, 'secondary'], ['confirmed', bookingsByStatus.confirmed, 'default'], ['cancelled', bookingsByStatus.cancelled, 'destructive']] as const).map(([s, count, v]) => (
                            <div key={s} className="flex items-center justify-between">
                                <Badge variant={v}>{s}</Badge>
                                <span className="text-lg font-bold">{count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Interactions by type */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PhoneCall className="h-4 w-4" />Interactions by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {interactionsByType.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No interactions yet.</p>
                        ) : interactionsByType.map((r) => (
                            <div key={r.type} className="flex items-center justify-between">
                                <Badge variant="secondary">{r.type}</Badge>
                                <span className="text-lg font-bold">{r.count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top clients by booking value */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Clients by Booking Value</CardTitle>
                        <CardDescription>Confirmed + pending bookings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topClients.length === 0 ? (
                                    <TableRow><TableCell colSpan={2} className="py-6 text-center text-muted-foreground">No data yet.</TableCell></TableRow>
                                ) : topClients.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell className="text-right">{fmt(c.total_value)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Reports.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'CRM Dashboard', href: crm.dashboard().url },
        { title: 'Reports', href: '/crm/reports' },
    ],
}

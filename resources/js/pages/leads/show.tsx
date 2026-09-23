import { Head, Link, router, usePage } from '@inertiajs/react'
import { ArrowLeft, Pencil, PhoneCall, CalendarDays, UserPlus, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import leads from '@/routes/leads'
import interactions from '@/routes/interactions'
import meetings from '@/routes/meetings'
import { dashboard } from '@/routes'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface User {
    id: number
    name: string
}

interface Interaction {
    id: number
    type: string
    subject: string
    notes: string | null
    interaction_date: string
    recorded_by: User | null
}

interface Meeting {
    id: number
    title: string
    location: string | null
    scheduled_at: string
    status: string
    notes: string | null
    outcome: string | null
    organizer: User | null
}

interface Stage {
    key: string
    badge: string
    probability: number
}

interface ConvertedClient {
    id: number
    contact_person: string
    company_name: string | null
    owner_id: string
}

interface Lead {
    id: number
    contact_person: string
    company_name: string | null
    email: string | null
    phone: string | null
    source: string | null
    stage: string
    probability: number
    value: string
    follow_up_date: string | null
    notes: string | null
    assigned_to: User | null
    converted_client_id: number | null
    converted_at: string | null
    converted_client: ConvertedClient | null
    interactions: Interaction[]
    meetings: Meeting[]
}

function stageBadgeVariant(stage: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (stage) {
        case 'Lost': return 'destructive'
        case 'Awarded':
        case 'On Hold': return 'outline'
        case 'Proposal / BOQ':
        case 'Negotiation': return 'default'
        default: return 'secondary'
    }
}

export default function Show() {
    const { lead, stages } = usePage<{ lead: Lead; stages: Stage[] }>().props

    function handleDelete() {
        if (!confirm(`Delete lead "${lead.contact_person}"?`)) return
        router.delete(leads.destroy(lead.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Lead deleted'),
        })
    }

    function handleConvert() {
        if (!confirm(`Convert "${lead.contact_person}" to a Client? This will create a new client profile.`)) return
        router.post(`/leads/${lead.id}/convert`, {}, {
            preserveScroll: true,
            onError: () => toast.error('Conversion failed'),
        })
    }

    const isConverted = !!lead.converted_client_id

    return (
        <>
            <Head title={lead.contact_person} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={leads.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{lead.company_name || lead.contact_person}</h1>
                        {isConverted && (
                            <Badge variant="outline" className="border-green-500 text-green-600 gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Converted
                            </Badge>
                        )}
                    </div>
                    <div className="ml-auto flex flex-wrap gap-2">
                        <Link href={interactions.create().url + `?lead_id=${lead.id}`}>
                            <Button variant="outline"><PhoneCall className="mr-2 h-4 w-4" />Log Interaction</Button>
                        </Link>
                        <Link href={meetings.create().url + `?lead_id=${lead.id}`}>
                            <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4" />Schedule Meeting</Button>
                        </Link>
                        {isConverted ? (
                            <Link href={`/flat-owners/${lead.converted_client_id}`}>
                                <Button variant="outline" className="border-green-500 text-green-600">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />View Client
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" className="border-blue-500 text-blue-600" onClick={handleConvert}>
                                <UserPlus className="mr-2 h-4 w-4" />Convert to Client
                            </Button>
                        )}
                        <Link href={leads.edit(lead.id).url}>
                            <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>

                {isConverted && lead.converted_client && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm dark:border-green-800 dark:bg-green-950">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-green-800 dark:text-green-300">
                            Converted to client{' '}
                            <Link href={`/flat-owners/${lead.converted_client.id}`} className="font-semibold underline hover:no-underline">
                                {lead.converted_client.company_name || lead.converted_client.contact_person}
                            </Link>
                            {lead.converted_at && <> on {lead.converted_at.slice(0, 10)}</>}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Lead Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Contact Person</p>
                                <p className="mt-0.5 font-medium">{lead.contact_person}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Company</p>
                                <p className="mt-0.5">{lead.company_name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Email</p>
                                <p className="mt-0.5">{lead.email || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                                <p className="mt-0.5">{lead.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Source</p>
                                <p className="mt-0.5">{lead.source || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Assigned To</p>
                                <p className="mt-0.5">{lead.assigned_to?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Stage</p>
                                <p className="mt-0.5">
                                    <Badge variant={stageBadgeVariant(lead.stage)}>{lead.stage}</Badge>
                                    <span className="ml-1 text-xs text-muted-foreground">{lead.probability}%</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Expected Value</p>
                                <p className="mt-0.5 font-medium">৳{Number(lead.value).toLocaleString('en-US')}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Follow-up Date</p>
                                <p className="mt-0.5">{lead.follow_up_date || '—'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-muted-foreground">Notes</p>
                                <p className="mt-0.5 whitespace-pre-wrap">{lead.notes || '—'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pipeline</CardTitle>
                            <CardDescription>Stage progression for this lead</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stages.map((s) => {
                                const isCurrent = s.key === lead.stage
                                const reached = stages.findIndex((x) => x.key === lead.stage) >= stages.findIndex((x) => x.key === s.key)
                                return (
                                    <div key={s.key} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isCurrent ? 'border-primary bg-primary/5' : reached ? 'bg-accent/50' : 'opacity-40'}`}>
                                        <span className="text-sm font-medium">{s.key}</span>
                                        {isCurrent && <Badge variant="default">Current · {s.probability}%</Badge>}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Interactions</CardTitle>
                            <Link href={interactions.create().url + `?lead_id=${lead.id}`}>
                                <Button size="sm" variant="outline"><PhoneCall className="mr-2 h-3 w-3" />Log</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Recorded By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lead.interactions.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No interactions yet.</TableCell></TableRow>
                                ) : lead.interactions.map((i) => (
                                    <TableRow key={i.id}>
                                        <TableCell className="text-muted-foreground">{i.interaction_date}</TableCell>
                                        <TableCell><Badge variant="secondary">{i.type}</Badge></TableCell>
                                        <TableCell className="font-medium">{i.subject}</TableCell>
                                        <TableCell className="max-w-xs truncate">{i.notes || '—'}</TableCell>
                                        <TableCell>{i.recorded_by?.name || '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Meetings & Site Visits</CardTitle>
                            <Link href={meetings.create().url + `?lead_id=${lead.id}`}>
                                <Button size="sm" variant="outline"><CalendarDays className="mr-2 h-3 w-3" />Schedule</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Scheduled</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Outcome</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lead.meetings.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No meetings yet.</TableCell></TableRow>
                                ) : lead.meetings.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.title}</TableCell>
                                        <TableCell>{m.scheduled_at}</TableCell>
                                        <TableCell>{m.location || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={m.status === 'Completed' ? 'outline' : m.status === 'Cancelled' ? 'destructive' : 'default'}>
                                                {m.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">{m.outcome || '—'}</TableCell>
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

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Leads & Opportunities', href: '/leads' },
        { title: 'Lead Detail', href: '/leads' },
    ],
}

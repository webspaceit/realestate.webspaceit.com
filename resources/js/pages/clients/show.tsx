import { Head, Link, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, FileDown, UserCircle, PhoneCall, CalendarDays, CalendarCheck } from 'lucide-react'
import { pdf } from '@/routes/flat-owners'
import interactions from '@/routes/interactions'
import meetings from '@/routes/meetings'
import bookings from '@/routes/bookings'

interface User {
    id: number
    name: string
    email: string
}

interface Building {
    id: number
    name: string
}

interface Unit {
    id: number
    unit_number: string
    building: Building
}

interface Project {
    id: number
    name: string
}

interface ClientProperty {
    id: number
    unit: Unit
    project: Project | null
    ownership_start: string
    ownership_end: string | null
}

interface Nominee {
    id: number
    name: string
    relationship: string
    date_of_birth: string | null
    percentage: number | null
}

interface Interaction {
    id: number
    type: string
    subject: string
    notes: string | null
    interaction_date: string
    recorded_by: { id: number; name: string } | null
}

interface Meeting {
    id: number
    title: string
    location: string | null
    scheduled_at: string
    status: string
    outcome: string | null
    organizer: { id: number; name: string } | null
}

interface Booking {
    id: number
    booking_type: string
    booking_date: string
    status: string
    total_price: number | null
    down_payment: number | null
    unit: Unit & { price?: number }
}

interface Client {
    id: number
    user?: User
    owner_id: string
    company_name: string
    contact_person: string
    email: string
    phone: string
    phone_mobile: string
    phone_whatsapp: string
    date_of_birth: string
    nid_no: string
    tin_no: string
    passport_no: string
    driving_licence: string
    profession: string
    nationality: string
    father_name: string
    mother_name: string
    spouse_name: string
    spouse_nid_no: string
    present_address: string
    permanent_address: string
    professional_address: string
    address: string
    designation: string
    photo: string | null
    photo_url: string | null
    nominees: Nominee[]
    created_at: string
    properties: ClientProperty[]
    interactions: Interaction[]
    meetings: Meeting[]
    bookings: Booking[]
}

interface PageProps {
    client: Client
}

function statusBadge(s: string) {
    if (s === 'confirmed') return 'default' as const
    if (s === 'cancelled') return 'destructive' as const
    return 'secondary' as const
}

function meetingBadge(s: string) {
    if (s === 'Completed') return 'outline' as const
    if (s === 'Cancelled') return 'destructive' as const
    return 'default' as const
}

export default function Show() {
    const { client } = usePage<PageProps>().props

    return (
        <>
            <Head title={client.contact_person || client.company_name || 'Flat Owner'} />

            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/flat-owners">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Flat Owners Detail
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={interactions.create().url + `?client_id=${client.id}`}>
                            <PhoneCall className="mr-2 h-4 w-4" />Log Interaction
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={meetings.create().url + `?client_id=${client.id}`}>
                            <CalendarDays className="mr-2 h-4 w-4" />Schedule Meeting
                        </Link>
                    </Button>
                    <Button variant="outline" asChild disabled={!client.id}>
                        <a href={client.id ? pdf(client.id).url : '#'} target="_blank" rel="noreferrer">
                            <FileDown className="mr-2 h-4 w-4" />Download PDF
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-6">
                {/* ── Left column: profile card ── */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="flex flex-col items-center gap-3">
                            {client.photo_url ? (
                                <img src={client.photo_url} alt={client.contact_person || ''} className="h-20 w-20 rounded-full object-cover border" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                    <UserCircle className="h-10 w-10 text-primary" />
                                </div>
                            )}
                            <div className="text-center">
                                <CardTitle>{client.contact_person || client.company_name}</CardTitle>
                                <CardDescription>{client.designation}{client.designation && client.company_name ? ' — ' : ''}{client.company_name}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            ['ID / Number', client.owner_id],
                            ['Email', client.email],
                            ['Phone', client.phone],
                            ['Mobile', client.phone_mobile],
                            ['Whatsapp', client.phone_whatsapp],
                            ['Profession', client.profession],
                            ['Nationality', client.nationality],
                            ['Date of Birth', client.date_of_birth],
                        ].map(([label, val]) => val ? (
                            <div key={label}>
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-sm font-medium">{val}</p>
                            </div>
                        ) : null)}
                        {client.user && (
                            <div>
                                <p className="text-xs text-muted-foreground">Linked User</p>
                                <p className="text-sm font-medium">{client.user.name} ({client.user.email})</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground">Flat Owner Since</p>
                            <p className="text-sm font-medium">{new Date(client.created_at).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Right column: detail cards ── */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Identification</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            {[['NID No.', client.nid_no], ['TIN No.', client.tin_no], ['Passport No.', client.passport_no], ['Driving Licence', client.driving_licence]].map(([l, v]) => (
                                <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="font-medium">{v || '-'}</p></div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Family Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            {[['Father\'s Name', client.father_name], ['Mother\'s Name', client.mother_name], ['Spouse Name', client.spouse_name], ['Spouse NID No.', client.spouse_nid_no]].map(([l, v]) => (
                                <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="font-medium">{v || '-'}</p></div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Addresses</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {[['Address', client.address], ['Present Address', client.present_address], ['Permanent Address', client.permanent_address], ['Professional Address', client.professional_address]].map(([l, v]) => v ? (
                                <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="font-medium">{v}</p></div>
                            ) : null)}
                        </CardContent>
                    </Card>

                    {/* Nominees */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Nominees</CardTitle>
                            <CardDescription>Nominee details for this flat owner</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead><TableHead>Relationship</TableHead>
                                        <TableHead>Date of Birth</TableHead><TableHead>Percentage</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.nominees.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No nominees added.</TableCell></TableRow>
                                    ) : client.nominees.map((n) => (
                                        <TableRow key={n.id}>
                                            <TableCell className="font-medium">{n.name}</TableCell>
                                            <TableCell>{n.relationship}</TableCell>
                                            <TableCell>{n.date_of_birth ? new Date(n.date_of_birth).toLocaleDateString() : '-'}</TableCell>
                                            <TableCell>{n.percentage != null ? `${n.percentage}%` : '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Properties */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Properties</CardTitle>
                            <CardDescription>Units owned by this flat owner</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project</TableHead><TableHead>Unit</TableHead><TableHead>Building</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.properties.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No properties assigned.</TableCell></TableRow>
                                    ) : client.properties.map((cp) => (
                                        <TableRow key={cp.id}>
                                            <TableCell>{cp.project?.name || '-'}</TableCell>
                                            <TableCell className="font-medium">{cp.unit.unit_number}</TableCell>
                                            <TableCell>{cp.unit.building.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Bookings ── */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />Bookings</CardTitle>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={bookings.create().url}>New Booking</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead><TableHead>Unit</TableHead>
                                <TableHead>Type</TableHead><TableHead>Status</TableHead>
                                <TableHead className="text-right">Total Price</TableHead>
                                <TableHead className="text-right">Down Payment</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {client.bookings.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="py-6 text-center text-muted-foreground">No bookings yet.</TableCell></TableRow>
                            ) : client.bookings.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell>{b.booking_date}</TableCell>
                                    <TableCell>{b.unit?.unit_number} — {b.unit?.building?.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{b.booking_type}</Badge></TableCell>
                                    <TableCell><Badge variant={statusBadge(b.status)}>{b.status}</Badge></TableCell>
                                    <TableCell className="text-right">{b.total_price ? `৳${Number(b.total_price).toLocaleString('en-US')}` : '—'}</TableCell>
                                    <TableCell className="text-right">{b.down_payment ? `৳${Number(b.down_payment).toLocaleString('en-US')}` : '—'}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={bookings.show(b.id).url}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ── Interactions ── */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><PhoneCall className="h-4 w-4" />Interactions</CardTitle>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={interactions.create().url + `?client_id=${client.id}`}>Log Interaction</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead><TableHead>Type</TableHead>
                                <TableHead>Subject</TableHead><TableHead>Notes</TableHead>
                                <TableHead>Recorded By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {client.interactions.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No interactions yet.</TableCell></TableRow>
                            ) : client.interactions.map((i) => (
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

            {/* ── Meetings ── */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Meetings & Site Visits</CardTitle>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={meetings.create().url + `?client_id=${client.id}`}>Schedule Meeting</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead><TableHead>Scheduled</TableHead>
                                <TableHead>Location</TableHead><TableHead>Status</TableHead>
                                <TableHead>Outcome</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {client.meetings.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No meetings yet.</TableCell></TableRow>
                            ) : client.meetings.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">{m.title}</TableCell>
                                    <TableCell>{m.scheduled_at}</TableCell>
                                    <TableCell>{m.location || '—'}</TableCell>
                                    <TableCell><Badge variant={meetingBadge(m.status)}>{m.status}</Badge></TableCell>
                                    <TableCell className="max-w-xs truncate">{m.outcome || '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

Show.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Owners Detail', href: '/flat-owners' },
        { title: props.client.contact_person || props.client.company_name, href: props.client.id ? '/flat-owners/' + props.client.id : '/flat-owners' },
    ],
})

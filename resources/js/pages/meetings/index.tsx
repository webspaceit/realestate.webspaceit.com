import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { dashboard } from '@/routes'
import meetings from '@/routes/meetings'

interface PartyRef {
    id: number
    contact_person: string
    company_name: string | null
}

interface Meeting {
    id: number
    title: string
    location: string | null
    scheduled_at: string
    status: string
    outcome: string | null
    lead: PartyRef | null
    client: PartyRef | null
    organizer: { id: number; name: string } | null
}

interface PageProps {
    meetings: { data: Meeting[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { search?: string; status?: string; from?: string; to?: string }
    statuses: string[]
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    Scheduled: 'default',
    Completed: 'outline',
    Cancelled: 'destructive',
}

export default function Index() {
    const { meetings: paginated, filters, statuses } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search || '')
    const [status, setStatus] = useState(filters.status || '')
    const [from, setFrom] = useState(filters.from || '')
    const [to, setTo] = useState(filters.to || '')

    function handleFilter() {
        router.get(meetings.index().url, { search, status, from, to }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(meetingId: number) {
        if (!confirm('Are you sure you want to delete this meeting?')) return
        router.delete(meetings.destroy(meetingId).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Meeting deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Meetings & Site Visits" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Meetings & Site Visits</h1>
                <Button asChild>
                    <Link href={meetings.create().url}>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Meeting
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-56"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div className="w-44 space-y-1">
                            <Label>Status</Label>
                            <Select value={status || undefined} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setTimeout(handleFilter); }}>
                                <SelectTrigger><SelectValue placeholder="Select Status..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>From</Label>
                            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
                        </div>
                        <div className="space-y-1">
                            <Label>To</Label>
                            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
                        </div>
                        <Button variant="outline" onClick={handleFilter}>Search</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Scheduled</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>With</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No meetings found.</TableCell>
                                </TableRow>
                            ) : (
                                paginated.data.map((meeting) => (
                                    <TableRow key={meeting.id}>
                                        <TableCell className="font-medium">{meeting.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{meeting.scheduled_at}</TableCell>
                                        <TableCell>{meeting.location || '—'}</TableCell>
                                        <TableCell>
                                            {meeting.lead?.company_name || meeting.lead?.contact_person ||
                                                meeting.client?.company_name || meeting.client?.contact_person || '—'}
                                        </TableCell>
                                        <TableCell><Badge variant={statusVariant[meeting.status] || 'secondary'}>{meeting.status}</Badge></TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={meetings.edit(meeting.id).url}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(meeting.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {paginated.total > paginated.per_page && (
                <div className="mt-4 flex justify-center gap-1">
                    {paginated.links.map((link, i) => (
                        link.url ? (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <Button key={i} variant="outline" size="sm" disabled dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </>
    )
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Meetings & Site Visits', href: '/meetings' },
    ],
}
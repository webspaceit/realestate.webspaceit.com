import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Eye, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { dashboard } from '@/routes'
import leads from '@/routes/leads'

interface User {
    id: number
    name: string
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
    assigned_to: User | null
    created_at: string
}

interface Stage {
    key: string
    badge: string
    probability: number
}

interface PageProps {
    leads: { data: Lead[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { search?: string; stage?: string; source?: string; assigned_to_id?: string }
    users: User[]
    stages: Stage[]
    sources: string[]
}

function stageBadgeVariant(stage: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (stage) {
        case 'Lost':
            return 'destructive'
        case 'Awarded':
            return 'outline'
        case 'On Hold':
            return 'outline'
        case 'Proposal / BOQ':
        case 'Negotiation':
            return 'default'
        default:
            return 'secondary'
    }
}

export default function Index() {
    const { leads: paginated, filters, users, stages, sources } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search || '')
    const [stage, setStage] = useState(filters.stage || '')
    const [source, setSource] = useState(filters.source || '')
    const [assignedToId, setAssignedToId] = useState(filters.assigned_to_id || '')

    function handleFilter() {
        router.get(leads.index().url, { search, stage, source, assigned_to_id: assignedToId }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(leadId: number) {
        if (!confirm('Are you sure you want to delete this lead?')) return
        router.delete(leads.destroy(leadId).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Lead deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Leads & Opportunities" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Leads & Opportunities</h1>
                <Button asChild>
                    <Link href={leads.create().url}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Lead
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
                                placeholder="Search name, company, email or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div className="w-52 space-y-1">
                            <Label>Stage</Label>
                            <Select value={stage} onValueChange={(v) => { setStage(v === 'all' ? '' : v); setTimeout(handleFilter); }}>
                                <SelectTrigger><SelectValue placeholder="All stages" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All stages</SelectItem>
                                    {stages.map((s) => (
                                        <SelectItem key={s.key} value={s.key}>{s.key}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-52 space-y-1">
                            <Label>Source</Label>
                            <Select value={source} onValueChange={(v) => { setSource(v === 'all' ? '' : v); setTimeout(handleFilter); }}>
                                <SelectTrigger><SelectValue placeholder="All sources" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All sources</SelectItem>
                                    {sources.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-52 space-y-1">
                            <Label>Assigned To</Label>
                            <Select value={assignedToId} onValueChange={(v) => { setAssignedToId(v === 'all' ? '' : v); setTimeout(handleFilter); }}>
                                <SelectTrigger><SelectValue placeholder="All users" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All users</SelectItem>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <TableHead>Contact</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead>Follow-up</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No leads found.</TableCell>
                                </TableRow>
                            ) : (
                                paginated.data.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            <div className="font-medium">{lead.contact_person}</div>
                                            <div className="text-xs text-muted-foreground">{lead.email || lead.phone || ''}</div>
                                        </TableCell>
                                        <TableCell>{lead.company_name || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={stageBadgeVariant(lead.stage)}>{lead.stage}</Badge>
                                            <span className="ml-1 text-xs text-muted-foreground">{lead.probability}%</span>
                                        </TableCell>
                                        <TableCell className="text-right">৳{Number(lead.value).toLocaleString('en-US')}</TableCell>
                                        <TableCell>{lead.follow_up_date || '—'}</TableCell>
                                        <TableCell>{lead.assigned_to?.name || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={leads.show(lead.id).url}><Eye className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={leads.edit(lead.id).url}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}>
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
        { title: 'Leads & Opportunities', href: '/leads' },
    ],
}
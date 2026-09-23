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
import interactions from '@/routes/interactions'

interface PartyRef {
    id: number
    contact_person: string
    company_name: string | null
}

interface Interaction {
    id: number
    type: string
    subject: string
    notes: string | null
    interaction_date: string
    lead: PartyRef | null
    client: PartyRef | null
    recorded_by: { id: number; name: string } | null
}

interface PageProps {
    interactions: { data: Interaction[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { search?: string; type?: string; from?: string; to?: string }
    types: string[]
}

export default function Index() {
    const { interactions: paginated, filters, types } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search || '')
    const [type, setType] = useState(filters.type || '')
    const [from, setFrom] = useState(filters.from || '')
    const [to, setTo] = useState(filters.to || '')

    function handleFilter() {
        router.get(interactions.index().url, { search, type, from, to }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(interactionId: number) {
        if (!confirm('Are you sure you want to delete this interaction?')) return
        router.delete(interactions.destroy(interactionId).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Interaction deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Interactions" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Interactions</h1>
                <Button asChild>
                    <Link href={interactions.create().url}>
                        <Plus className="mr-2 h-4 w-4" />
                        Log Interaction
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
                                placeholder="Search subject..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-56"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div className="w-44 space-y-1">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={(v) => { setType(v === 'all' ? '' : v); setTimeout(handleFilter); }}>
                                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
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
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Related To</TableHead>
                                <TableHead>Recorded By</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No interactions found.</TableCell>
                                </TableRow>
                            ) : (
                                paginated.data.map((interaction) => (
                                    <TableRow key={interaction.id}>
                                        <TableCell className="text-muted-foreground">{interaction.interaction_date}</TableCell>
                                        <TableCell><Badge variant="secondary">{interaction.type}</Badge></TableCell>
                                        <TableCell className="font-medium">{interaction.subject}</TableCell>
                                        <TableCell>
                                            {interaction.lead?.company_name || interaction.lead?.contact_person ||
                                                interaction.client?.company_name || interaction.client?.contact_person || '—'}
                                        </TableCell>
                                        <TableCell>{interaction.recorded_by?.name || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={interactions.edit(interaction.id).url}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(interaction.id)}>
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
        { title: 'Interactions', href: '/interactions' },
    ],
}
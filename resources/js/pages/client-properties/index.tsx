import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { index as indexRoute, edit, create, show as showRoute, destroy } from '@/routes/client-properties'

interface Building {
    id: number
    name: string
}

interface Unit {
    id: number
    unit_number: string
    building: Building
}

interface Client {
    id: number
    contact_person: string
}

interface ClientProperty {
    id: number
    client: Client
    unit: Unit
    ownership_start: string
    ownership_end: string | null
}

interface PageProps {
    clientProperties: { data: ClientProperty[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { client_id?: string }
    clients: Client[]
}

export default function Index() {
    const { clientProperties, filters, clients } = usePage<PageProps>().props
    const [clientId, setClientId] = useState(filters.client_id || '')

    function handleFilter() {
        router.get(indexRoute(), { client_id: clientId }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this client property?')) return
        router.delete(destroy(id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Client property deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Client Properties" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Client Properties</h1>
                <Button asChild>
                    <Link href={create()}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Assignment
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="w-64 space-y-1">
                            <Label htmlFor="client_id">Client</Label>
                            <Select value={clientId} onValueChange={setClientId}>
                                <SelectTrigger id="client_id">
                                    <SelectValue placeholder="All Clients" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Clients</SelectItem>
                                    {clients.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.contact_person}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleFilter}>Apply</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Building</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead className="w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientProperties.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No client properties found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clientProperties.data.map((cp) => (
                                    <TableRow key={cp.id}>
                                        <TableCell className="font-medium">{cp.client.contact_person}</TableCell>
                                        <TableCell>{cp.unit.unit_number}</TableCell>
                                        <TableCell>{cp.unit.building.name}</TableCell>
                                        <TableCell>{new Date(cp.ownership_start).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {cp.ownership_end ? new Date(cp.ownership_end).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={showRoute(cp.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(cp.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(cp.id)}>
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

            {clientProperties.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {clientProperties.from} to {clientProperties.to} of {clientProperties.total}
                    </p>
                    <div className="flex gap-1">
                        {clientProperties.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, {}, { preserveState: true, preserveScroll: true })
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Client Properties', href: '/client-properties' },
    ],
}

import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'
import { index as indexRoute, edit, create, show as showRoute, destroy } from '@/routes/flat-owners'

interface User {
    id: number
    name: string
    email: string
}

interface Client {
    id: number
    user?: User
    owner_id: string
    company_name: string
    contact_person: string
    father_name: string
    email: string
    profession: string
    nationality: string
    phone_mobile: string
    phone_whatsapp: string
    created_at: string
}

interface PageProps {
    clients: { data: Client[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { search?: string }
}

export default function Index() {
    const { clients, filters } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search || '')

    function handleFilter() {
        router.get(indexRoute(), { search }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(clientId: number) {
        if (!confirm('Are you sure you want to delete this flat owner?')) return
        router.delete(destroy(clientId), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Flat Owner deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Flat Owners Detail" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Flat Owners Detail</h1>
                <Button asChild>
                    <Link href={create()}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Flat Owner
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="search">Search flat owners</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by company or contact person..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleFilter}>Search</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">ID / Number</TableHead>
                                <TableHead className="font-bold">Name of Flat Owners</TableHead>
                                <TableHead className="font-bold">Father's Name</TableHead>
                                <TableHead className="font-bold">Company Name</TableHead>
                                <TableHead className="font-bold">E-mail</TableHead>
                                <TableHead className="font-bold">Profession</TableHead>
                                <TableHead className="font-bold">Nationality</TableHead>
                                <TableHead className="font-bold">Mobile</TableHead>
                                <TableHead className="font-bold">Whatsapp</TableHead>
                                <TableHead className="w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                                        No flat owners found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.data.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-mono text-xs">{client.owner_id}</TableCell>
                                        <TableCell className="font-medium">{client.contact_person}</TableCell>
                                        <TableCell>{client.father_name || '-'}</TableCell>
                                        <TableCell>{client.company_name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.profession || '-'}</TableCell>
                                        <TableCell>{client.nationality || '-'}</TableCell>
                                        <TableCell>{client.phone_mobile || '-'}</TableCell>
                                        <TableCell>{client.phone_whatsapp || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={showRoute(client.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(client.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
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

            {clients.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {clients.from} to {clients.to} of {clients.total}
                    </p>
                    <div className="flex gap-1">
                        {clients.links.map((link, i) => (
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
        { title: 'Flat Owners Detail', href: '/flat-owners' },
    ],
}

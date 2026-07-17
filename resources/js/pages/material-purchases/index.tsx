import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as purchasesIndex, destroy as purchasesDestroy } from '@/routes/material-purchases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Material { id: number; name: string }
interface Supplier { id: number; name: string }

interface Purchase {
    id: number
    material: Material
    supplier: Supplier
    quantity: number
    unit_price: number
    total_price: number
    purchase_date: string
    status: string
}

interface PageProps {
    purchases: { data: Purchase[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { material_id?: string; supplier_id?: string; status?: string }
    materials: Material[]
    suppliers: Supplier[]
}

const statusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'outline',
    approved: 'default',
    received: 'secondary',
    cancelled: 'destructive',
}

export default function PurchasesIndex() {
    const { purchases, filters, materials, suppliers } = usePage<PageProps>().props
    const [materialId, setMaterialId] = useState(filters.material_id ?? '')
    const [supplierId, setSupplierId] = useState(filters.supplier_id ?? '')
    const [status, setStatus] = useState(filters.status ?? '')

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        router.get(purchasesIndex().url, {
            material_id: materialId || undefined,
            supplier_id: supplierId || undefined,
            status: status || undefined,
        }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this purchase?')) return
        router.delete(purchasesDestroy(id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Purchase deleted') })
    }

    return (
        <>
            <Head title="Material Purchases" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Material Purchases</h1>
                    <Link href={purchasesIndex().url + '/create'}>
                        <Button><Plus className="mr-2 size-4" />Add Purchase</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filter</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex items-end gap-4">
                            <div className="space-y-2">
                                <Label>Material</Label>
                                <Select value={materialId} onValueChange={setMaterialId}>
                                    <SelectTrigger className="w-48"><SelectValue placeholder="All materials" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All materials</SelectItem>
                                        {materials.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Supplier</Label>
                                <Select value={supplierId} onValueChange={setSupplierId}>
                                    <SelectTrigger className="w-48"><SelectValue placeholder="All suppliers" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All suppliers</SelectItem>
                                        {suppliers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="received">Received</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit"><Search className="mr-2 size-4" />Search</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.data.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.material.name}</TableCell>
                                        <TableCell>{p.supplier.name}</TableCell>
                                        <TableCell>{p.quantity}</TableCell>
                                        <TableCell>৳{Number(p.unit_price).toFixed(2)}</TableCell>
                                        <TableCell>৳{Number(p.total_price).toFixed(2)}</TableCell>
                                        <TableCell>{p.purchase_date}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[p.status] ?? 'outline'}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={purchasesIndex().url + '/' + p.id}>
                                                    <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                                </Link>
                                                <Link href={purchasesIndex().url + '/' + p.id + '/edit'}>
                                                    <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {purchases.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No purchases found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {purchases.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {purchases.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }) }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

PurchasesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Material Purchases', href: purchasesIndex() },
    ],
}

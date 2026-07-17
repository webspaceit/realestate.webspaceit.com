import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as inventoryIndex, destroy as inventoryDestroy } from '@/routes/inventory'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Material {
    id: number
    name: string
    unit: string
}

interface InventoryItem {
    id: number
    material: Material
    quantity: number
    minimum_quantity: number
    location: string
}

interface PageProps {
    inventory: { data: InventoryItem[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { search?: string; low_stock?: boolean }
}

export default function InventoryIndex() {
    const { inventory, filters } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search ?? '')
    const [lowStock, setLowStock] = useState(filters.low_stock ?? false)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        router.get(inventoryIndex().url, { search, low_stock: lowStock || undefined }, { preserveState: true, preserveScroll: true })
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this inventory item?')) return
        router.delete(inventoryDestroy(id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Inventory item deleted') })
    }

    return (
        <>
            <Head title="Inventory" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Inventory</h1>
                    <Link href={inventoryIndex().url + '/create'}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Add Item
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1 block">Search Material</label>
                                <Input placeholder="Search by material name..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2 pb-1">
                                <Checkbox id="low_stock" checked={lowStock} onCheckedChange={v => setLowStock(v === true)} />
                                <label htmlFor="low_stock" className="text-sm font-medium">Low Stock Only</label>
                            </div>
                            <Button type="submit">
                                <Search className="mr-2 size-4" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Min Qty</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.data.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.material.name}</TableCell>
                                        <TableCell>{item.quantity} {item.material.unit}</TableCell>
                                        <TableCell>{item.minimum_quantity} {item.material.unit}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.quantity <= item.minimum_quantity ? 'destructive' : 'secondary'}>
                                                {item.quantity <= item.minimum_quantity ? 'Low' : 'OK'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={inventoryIndex().url + '/' + item.id}>
                                                    <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                                </Link>
                                                <Link href={inventoryIndex().url + '/' + item.id + '/edit'}>
                                                    <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {inventory.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No inventory items found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {inventory.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {inventory.links.map((link, i) => (
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
                )}
            </div>
        </>
    )
}

InventoryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inventory', href: inventoryIndex() },
    ],
}

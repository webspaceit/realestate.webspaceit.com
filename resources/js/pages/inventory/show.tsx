import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as inventoryIndex, destroy as inventoryDestroy } from '@/routes/inventory'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Material {
    id: number
    name: string
    unit: string
}

interface Movement {
    id: number
    created_at: string
    quantity_change: number
    type: string
    notes: string
}

interface InventoryItem {
    id: number
    material: Material
    quantity: number
    minimum_quantity: number
    location: string
    movements: Movement[]
}

interface PageProps {
    inventory_item: InventoryItem
}

export default function InventoryShow() {
    const { inventory_item } = usePage<PageProps>().props
    const status = inventory_item.quantity <= inventory_item.minimum_quantity ? 'Low' : 'OK'

    function handleDelete() {
        if (!confirm('Are you sure you want to delete this inventory item?')) return
        router.delete(inventoryDestroy(inventory_item.id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Inventory item deleted') })
    }

    return (
        <>
            <Head title={inventory_item.material.name} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={inventoryIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{inventory_item.material.name}</h1>
                    <Badge variant={status === 'Low' ? 'destructive' : 'secondary'}>{status}</Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">Material</dt>
                                <dd className="font-medium">{inventory_item.material.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Unit</dt>
                                <dd className="font-medium">{inventory_item.material.unit}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Quantity</dt>
                                <dd className="font-medium">{inventory_item.quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Minimum Quantity</dt>
                                <dd className="font-medium">{inventory_item.minimum_quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Location</dt>
                                <dd className="font-medium">{inventory_item.location}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Movements</CardTitle>
                        <div className="flex gap-2">
                            <Link href={inventoryIndex().url + '/' + inventory_item.id + '/edit'}>
                                <Button variant="outline" size="sm"><Pencil className="mr-2 size-4" />Edit</Button>
                            </Link>
                            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 size-4" />Delete</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory_item.movements?.map(m => (
                                    <TableRow key={m.id}>
                                        <TableCell>{m.created_at}</TableCell>
                                        <TableCell className={m.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                                        </TableCell>
                                        <TableCell>{m.type}</TableCell>
                                        <TableCell>{m.notes}</TableCell>
                                    </TableRow>
                                ))}
                                {(!inventory_item.movements || inventory_item.movements.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No movements recorded.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

InventoryShow.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inventory', href: inventoryIndex() },
        { title: props.inventory_item?.material?.name ?? 'Detail', href: '#' },
    ],
})

import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as purchasesIndex, destroy as purchasesDestroy } from '@/routes/material-purchases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
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
    material_purchase: Purchase
}

const statusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'outline',
    approved: 'default',
    received: 'secondary',
    cancelled: 'destructive',
}

export default function PurchaseShow() {
    const { material_purchase } = usePage<PageProps>().props

    function handleDelete() {
        if (!confirm('Are you sure you want to delete this purchase?')) return
        router.delete(purchasesDestroy(material_purchase.id).url, { preserveState: true, preserveScroll: true, onSuccess: () => toast.success('Purchase deleted') })
    }

    return (
        <>
            <Head title={`Purchase #${material_purchase.id}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={purchasesIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Purchase #{material_purchase.id}</h1>
                    <Badge variant={statusColors[material_purchase.status] ?? 'outline'}>{material_purchase.status}</Badge>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Details</CardTitle>
                        <div className="flex gap-2">
                            <Link href={purchasesIndex().url + '/' + material_purchase.id + '/edit'}>
                                <Button variant="outline" size="sm"><Pencil className="mr-2 size-4" />Edit</Button>
                            </Link>
                            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 size-4" />Delete</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">Material</dt>
                                <dd className="font-medium">{material_purchase.material.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Supplier</dt>
                                <dd className="font-medium">{material_purchase.supplier.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Quantity</dt>
                                <dd className="font-medium">{material_purchase.quantity}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Unit Price</dt>
                                <dd className="font-medium">৳{Number(material_purchase.unit_price).toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Total Price</dt>
                                <dd className="font-medium">৳{Number(material_purchase.total_price).toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Purchase Date</dt>
                                <dd className="font-medium">{material_purchase.purchase_date}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

PurchaseShow.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Material Purchases', href: purchasesIndex() },
        { title: `Purchase #${props.material_purchase?.id ?? ''}`, href: '#' },
    ],
})

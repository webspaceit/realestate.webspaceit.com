import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as purchasesIndex, store as purchasesStore } from '@/routes/material-purchases'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Material { id: number; name: string }
interface Supplier { id: number; name: string }

interface PageProps {
    materials: Material[]
    suppliers: Supplier[]
}

export default function PurchaseCreate() {
    const { materials, suppliers } = usePage<PageProps>().props
    const [form, setForm] = useState({
        material_id: '',
        supplier_id: '',
        quantity: '',
        unit_price: '',
        purchase_date: '',
        status: 'pending',
    })
    const [processing, setProcessing] = useState(false)

    const total_price = (Number(form.quantity) * Number(form.unit_price)).toFixed(2)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.post(purchasesStore().url, {
            material_id: form.material_id,
            supplier_id: form.supplier_id,
            quantity: form.quantity,
            unit_price: form.unit_price,
            purchase_date: form.purchase_date,
            status: form.status,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Purchase created'); setProcessing(false) },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <>
            <Head title="Create Purchase" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={purchasesIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Purchase</h1>
                </div>

                <Card>
                    <CardHeader><CardTitle>Purchase Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="material_id">Material</Label>
                                <Select value={form.material_id} onValueChange={v => setForm(f => ({ ...f, material_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                                    <SelectContent>
                                        {materials.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supplier_id">Supplier</Label>
                                <Select value={form.supplier_id} onValueChange={v => setForm(f => ({ ...f, supplier_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" type="number" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit_price">Unit Price</Label>
                                <Input id="unit_price" type="number" step="0.01" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Price</Label>
                                <Input value={`৳${total_price}`} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchase_date">Purchase Date</Label>
                                <Input id="purchase_date" type="date" value={form.purchase_date} onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="received">Received</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <Link href={purchasesIndex()}><Button type="button" variant="outline">Cancel</Button></Link>
                                <Button type="submit" disabled={processing}>Create</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

PurchaseCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Material Purchases', href: purchasesIndex() },
        { title: 'Create', href: purchasesIndex().url + '/create' },
    ],
}

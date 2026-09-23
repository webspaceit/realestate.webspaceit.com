import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { index as inventoryIndex, store as inventoryStore } from '@/routes/inventory'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Material {
    id: number
    name: string
    unit: string
}

interface PageProps {
    materials: Material[]
}

export default function InventoryCreate() {
    const { materials } = usePage<PageProps>().props
    const [form, setForm] = useState({ material_id: '', quantity: '', minimum_quantity: '', location: '' })
    const [processing, setProcessing] = useState(false)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.post(inventoryStore().url, {
            material_id: form.material_id,
            quantity: form.quantity,
            minimum_quantity: form.minimum_quantity,
            location: form.location,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Inventory item created')
                setProcessing(false)
            },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <>
            <Head title="Create Inventory Item" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href={inventoryIndex()}>
                        <Button variant="outline" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Inventory Item</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="material_id">Material</Label>
                                <Select value={form.material_id} onValueChange={v => setForm(f => ({ ...f, material_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select Material..." /></SelectTrigger>
                                    <SelectContent>
                                        {materials.map(m => (
                                            <SelectItem key={m.id} value={String(m.id)}>{m.name} ({m.unit})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" type="number" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minimum_quantity">Minimum Quantity</Label>
                                <Input id="minimum_quantity" type="number" step="any" value={form.minimum_quantity} onChange={e => setForm(f => ({ ...f, minimum_quantity: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <Link href={inventoryIndex()}>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>Create</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

InventoryCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inventory', href: inventoryIndex() },
        { title: 'Create', href: inventoryIndex().url + '/create' },
    ],
}

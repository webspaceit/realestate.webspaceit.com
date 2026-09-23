import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { index, store } from '@/routes/client-properties'

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

interface PageProps {
    clients: Client[]
    units: Unit[]
}

export default function Create() {
    const { clients, units } = usePage<PageProps>().props
    const [clientId, setClientId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [ownershipStart, setOwnershipStart] = useState('')
    const [ownershipEnd, setOwnershipEnd] = useState('')
    const [processing, setProcessing] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.post(
            store(),
            {
                client_id: clientId,
                unit_id: unitId,
                ownership_start: ownershipStart,
                ownership_end: ownershipEnd || null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Client property created successfully')
                },
                onFinish: () => setProcessing(false),
            },
        )
    }

    const selectedUnit = units.find((u) => String(u.id) === unitId)

    return (
        <>
            <Head title="Create Client Property" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={index()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Client Properties
                    </Link>
                </Button>
            </div>

            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Assign Property to Client</CardTitle>
                    <CardDescription>Link a unit to a client</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="client_id">Client</Label>
                            <Select value={clientId} onValueChange={setClientId} required>
                                <SelectTrigger id="client_id">
                                    <SelectValue placeholder="Select Client..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.contact_person}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="unit_id">Unit</Label>
                            <Select value={unitId} onValueChange={setUnitId} required>
                                <SelectTrigger id="unit_id">
                                    <SelectValue placeholder="Select Unit..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                            {u.unit_number} - {u.building.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedUnit && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {selectedUnit.unit_number} in {selectedUnit.building.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="ownership_start">Ownership Start</Label>
                                <Input
                                    id="ownership_start"
                                    type="date"
                                    value={ownershipStart}
                                    onChange={(e) => setOwnershipStart(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="ownership_end">Ownership End</Label>
                                <Input
                                    id="ownership_end"
                                    type="date"
                                    value={ownershipEnd}
                                    onChange={(e) => setOwnershipEnd(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" asChild>
                                <Link href={index()}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Create Assignment'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Client Properties', href: '/client-properties' },
        { title: 'Create', href: '/client-properties/create' },
    ],
}

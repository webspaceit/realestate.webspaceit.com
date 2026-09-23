import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtDate, fmtDateInput } from '@/lib/utils';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { ArrowLeft, CalendarCheck, User, Home, DollarSign, Plus, Pencil, Trash2 } from 'lucide-react';

interface Building { id: number; name: string; address: string }
interface Unit { id: number; unit_number: string; building: Building; floor: number; area_sqft: number; price: number }
interface Client { id: number; contact_person: string; company_name: string; email: string; phone_mobile: string; owner_id: string }

interface PaymentSchedule {
    id: number
    label: string | null
    due_date: string
    amount: string
    paid_amount: string
    status: 'pending' | 'partial' | 'paid'
    paid_date: string | null
    notes: string | null
}

interface Booking {
    id: number
    client: Client
    unit: Unit
    booking_type: string
    booking_date: string
    status: string
    down_payment: number | null
    total_price: number | null
    notes: string | null
    created_at: string
    payment_schedules: PaymentSchedule[]
}

const blank = { label: '', due_date: '', amount: '', paid_amount: '0', paid_date: '', notes: '' }

export default function Show() {
    const { booking } = usePage<{ booking: Booking }>().props

    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)
    const [form, setForm] = useState(blank)
    const [processing, setProcessing] = useState(false)

    const totalScheduled = booking.payment_schedules.reduce((s, p) => s + Number(p.amount), 0)
    const totalPaid = booking.payment_schedules.reduce((s, p) => s + Number(p.paid_amount), 0)
    const totalDue = booking.total_price ? Number(booking.total_price) - totalPaid : null

    function openNew() { setEditId(null); setForm(blank); setShowForm(true) }
    function openEdit(p: PaymentSchedule) {
        setEditId(p.id)
        setForm({ label: p.label || '', due_date: p.due_date, amount: p.amount, paid_amount: p.paid_amount, paid_date: p.paid_date || '', notes: p.notes || '' })
        setShowForm(true)
    }
    function cancelForm() { setShowForm(false); setEditId(null); setForm(blank) }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        const payload = { ...form, paid_amount: form.paid_amount || '0', paid_date: form.paid_date || null }
        if (editId) {
            router.put(`/payment-schedules/${editId}`, payload, {
                preserveScroll: true,
                onSuccess: () => { toast.success('Entry updated'); cancelForm() },
                onFinish: () => setProcessing(false),
            })
        } else {
            router.post(`/bookings/${booking.id}/payment-schedules`, payload, {
                preserveScroll: true,
                onSuccess: () => { toast.success('Entry added'); cancelForm() },
                onFinish: () => setProcessing(false),
            })
        }
    }

    function handleDelete(id: number) {
        if (!confirm('Remove this payment entry?')) return
        router.delete(`/payment-schedules/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Entry removed'),
        })
    }

    const statusVariant = (s: string) => s === 'confirmed' ? 'default' as const : s === 'cancelled' ? 'destructive' as const : 'secondary' as const
    const typeVariant = (t: string) => t === 'sale' ? 'destructive' as const : 'secondary' as const
    const psVariant = (s: string) => s === 'paid' ? 'outline' as const : s === 'partial' ? 'default' as const : 'secondary' as const

    return (
        <>
            <Head title={`Booking #${booking.id}`} />

            <div className="flex items-center gap-2 mb-6">
                <Link href={bookings.index().url}>
                    <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
                </Link>
                <CalendarCheck className="size-6" />
                <h1 className="text-2xl font-semibold">Booking #{booking.id}</h1>
                <Badge variant={statusVariant(booking.status)} className="ml-2">{booking.status}</Badge>
                <Badge variant={typeVariant(booking.booking_type)} className="ml-1">{booking.booking_type}</Badge>
                <Button asChild className="ml-auto"><Link href={bookings.edit(booking.id).url}>Edit Booking</Link></Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Client */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><User className="size-4" />Client Information</CardTitle></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            {[['Owner ID', booking.client.owner_id], ['Name', booking.client.contact_person], ['Company', booking.client.company_name], ['Email', booking.client.email], ['Phone', booking.client.phone_mobile]].map(([k, v]) => (
                                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v || '-'}</dd></div>
                            ))}
                            <div className="col-span-2 mt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/flat-owners/${booking.client.id}`}>View Client Profile</Link>
                                </Button>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Unit */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Home className="size-4" />Unit Information</CardTitle></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            {[['Unit Number', booking.unit.unit_number], ['Building', booking.unit.building?.name], ['Floor', booking.unit.floor], ['Area (sqft)', booking.unit.area_sqft ? `${Number(booking.unit.area_sqft).toLocaleString('en-US')} sqft` : null], ['Price', booking.unit.price ? `৳${Number(booking.unit.price).toLocaleString('en-US')}` : null]].map(([k, v]) => (
                                <div key={String(k)}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v || '-'}</dd></div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>

                {/* Booking Details */}
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="size-4" />Booking Details</CardTitle></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-3 gap-4 text-sm">
                            <div><dt className="text-muted-foreground">Booking Date</dt><dd className="font-medium">{fmtDate(booking.booking_date)}</dd></div>
                            <div><dt className="text-muted-foreground">Down Payment</dt><dd className="font-medium">{booking.down_payment ? `৳${Number(booking.down_payment).toLocaleString('en-US')}` : '-'}</dd></div>
                            <div><dt className="text-muted-foreground">Total Price</dt><dd className="font-medium">{booking.total_price ? `৳${Number(booking.total_price).toLocaleString('en-US')}` : '-'}</dd></div>
                            {booking.notes && <div className="col-span-3"><dt className="text-muted-foreground">Notes</dt><dd className="mt-1 whitespace-pre-wrap">{booking.notes}</dd></div>}
                        </dl>
                    </CardContent>
                </Card>
            </div>

            {/* ── Payment Schedule ── */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2"><DollarSign className="size-4" />Payment Schedule</CardTitle>
                            <CardDescription>Track installment payments for this booking</CardDescription>
                        </div>
                        <Button size="sm" onClick={openNew} className="gap-1">
                            <Plus className="h-4 w-4" />Add Entry
                        </Button>
                    </div>
                </CardHeader>

                {/* Summary bar */}
                {booking.payment_schedules.length > 0 && (
                    <div className="mx-6 mb-4 grid grid-cols-3 gap-4 rounded-lg border bg-muted/40 p-4 text-sm">
                        <div><p className="text-xs text-muted-foreground">Total Scheduled</p><p className="font-semibold">৳{totalScheduled.toLocaleString('en-US')}</p></div>
                        <div><p className="text-xs text-muted-foreground">Total Paid</p><p className="font-semibold text-green-600">৳{totalPaid.toLocaleString('en-US')}</p></div>
                        <div><p className="text-xs text-muted-foreground">Balance Due</p><p className="font-semibold text-destructive">{totalDue !== null ? `৳${totalDue.toLocaleString('en-US')}` : '—'}</p></div>
                    </div>
                )}

                {/* Inline add/edit form */}
                {showForm && (
                    <div className="mx-6 mb-4 rounded-lg border bg-muted/30 p-4">
                        <p className="mb-3 text-sm font-semibold">{editId ? 'Edit Payment Entry' : 'New Payment Entry'}</p>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            <div className="space-y-1">
                                <Label>Label</Label>
                                <Input placeholder="e.g. Installment 1" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                            </div>
                            <div className="space-y-1">
                                <Label>Due Date <span className="text-destructive">*</span></Label>
                                <Input type="date" required value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                            </div>
                            <div className="space-y-1">
                                <Label>Amount (৳) <span className="text-destructive">*</span></Label>
                                <Input type="number" min={0} step="0.01" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                            </div>
                            <div className="space-y-1">
                                <Label>Paid Amount (৳)</Label>
                                <Input type="number" min={0} step="0.01" value={form.paid_amount} onChange={e => setForm(f => ({ ...f, paid_amount: e.target.value }))} placeholder="0.00" />
                            </div>
                            <div className="space-y-1">
                                <Label>Paid Date</Label>
                                <Input type="date" value={form.paid_date} onChange={e => setForm(f => ({ ...f, paid_date: e.target.value }))} />
                            </div>
                            <div className="space-y-1">
                                <Label>Notes</Label>
                                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional" />
                            </div>
                            <div className="col-span-2 flex gap-2 pt-1 md:col-span-3">
                                <Button type="submit" size="sm" disabled={processing}>{processing ? 'Saving...' : editId ? 'Update' : 'Add'}</Button>
                                <Button type="button" size="sm" variant="outline" onClick={cancelForm}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Paid</TableHead>
                                <TableHead>Paid Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.payment_schedules.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No payment entries yet. Click "Add Entry" to start.</TableCell></TableRow>
                            ) : booking.payment_schedules.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.label || '—'}</TableCell>
                                    <TableCell>{fmtDate(p.due_date)}</TableCell>
                                    <TableCell className="text-right font-medium">৳{Number(p.amount).toLocaleString('en-US')}</TableCell>
                                    <TableCell className="text-right text-green-600">৳{Number(p.paid_amount).toLocaleString('en-US')}</TableCell>
                                    <TableCell>{fmtDate(p.paid_date)}</TableCell>
                                    <TableCell><Badge variant={psVariant(p.status)}>{p.status}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="mt-6">
                <Button variant="outline" asChild>
                    <Link href={bookings.index().url}>Back to List</Link>
                </Button>
            </div>
        </>
    )
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Bookings', href: '/bookings' },
        { title: 'Details', href: '/bookings' },
    ],
}

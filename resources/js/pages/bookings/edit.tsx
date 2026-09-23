import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { ArrowLeft, CalendarCheck } from 'lucide-react';

interface Client {
    id: number;
    contact_person: string;
    company_name: string;
    phone_mobile: string;
}

interface Building {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    unit_number: string;
    building: Building;
    price: number | null;
    status: string;
}

interface Booking {
    id: number;
    client_id: number;
    unit_id: number;
    booking_type: string;
    booking_date: string;
    status: string;
    down_payment: number | null;
    total_price: number | null;
    notes: string | null;
}

export default function Edit({ booking, clients, units }: { booking: Booking; clients: Client[]; units: Unit[] }) {
    const [clientId, setClientId] = useState(String(booking.client_id));
    const [unitId, setUnitId] = useState(String(booking.unit_id));
    const [bookingType, setBookingType] = useState(booking.booking_type);
    const [bookingDate, setBookingDate] = useState(booking.booking_date ? booking.booking_date.slice(0, 10) : '');
    const [status, setStatus] = useState(booking.status);
    const [downPayment, setDownPayment] = useState(booking.down_payment?.toString() || '');
    const [totalPrice, setTotalPrice] = useState(booking.total_price?.toString() || '');
    const [notes, setNotes] = useState(booking.notes || '');
    const [processing, setProcessing] = useState(false);

    const filteredClients = clients.filter(c => c.contact_person || c.company_name);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(bookings.update(booking.id).url, {
            client_id: clientId,
            unit_id: unitId,
            booking_type: bookingType,
            booking_date: bookingDate,
            status,
            down_payment: downPayment || null,
            total_price: totalPrice || null,
            notes: notes || null,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Booking updated successfully');
            },
            onFinish: () => setProcessing(false),
        });
    }

    const selectedUnit = units.find(u => String(u.id) === unitId);

    return (
        <>
            <Head title="Edit Booking" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={bookings.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Bookings
                    </Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Booking #{booking.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SearchableSelect
                                label="Client"
                                placeholder="Select Client..."
                                options={filteredClients.map(c => ({
                                    value: String(c.id),
                                    label: `${c.contact_person || c.company_name} (${c.phone_mobile || 'N/A'})`,
                                }))}
                                value={clientId}
                                onChange={setClientId}
                            />

                            <SearchableSelect
                                label="Unit"
                                placeholder="Select Unit..."
                                options={units.map(u => ({
                                    value: String(u.id),
                                    label: `${u.unit_number} - ${u.building?.name || 'N/A'}${u.price ? ` (৳${Number(u.price).toLocaleString('en-US')})` : ''} [${u.status}]`,
                                }))}
                                value={unitId}
                                onChange={setUnitId}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="booking_type">Booking Type</Label>
                                    <Select value={bookingType || undefined} onValueChange={setBookingType}>
                                        <SelectTrigger id="booking_type">
                                            <SelectValue placeholder="Select Booking Type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="booking">Booking</SelectItem>
                                            <SelectItem value="sale">Sale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="booking_date">Booking Date</Label>
                                    <Input id="booking_date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status || undefined} onValueChange={setStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select Status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="total_price">Total Price (৳)</Label>
                                    <Input id="total_price" type="number" min={0} step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="0.00" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="down_payment">Down Payment (৳)</Label>
                                <Input id="down_payment" type="number" min={0} step="0.01" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="0.00" />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href={bookings.index().url}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing || !clientId || !unitId}>
                            {processing ? 'Saving...' : 'Update Booking'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Bookings', href: '/bookings' },
        { title: 'Edit', href: '/bookings/{booking}/edit' },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { CalendarCheck, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

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
}

interface Booking {
    id: number;
    client: Client;
    unit: Unit;
    booking_type: string;
    booking_date: string;
    status: string;
    down_payment: number | null;
    total_price: number | null;
    created_at: string;
}

interface Filters {
    search?: string;
    status?: string;
    booking_type?: string;
}

export default function Index({
    bookings: { data, last_page, links },
    filters,
}: {
    bookings: { data: Booking[]; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: Filters;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [bookingType, setBookingType] = useState(filters.booking_type || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(bookings.index().url, { search, status, booking_type: bookingType }, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        router.delete(bookings.destroy(id).url, {
            onSuccess: () => toast.success('Booking deleted'),
        });
    }

    const statusVariant = (s: string) => {
        switch (s) {
            case 'confirmed': return 'default' as const;
            case 'pending': return 'secondary' as const;
            case 'cancelled': return 'destructive' as const;
            default: return 'outline' as const;
        }
    };

    const typeVariant = (t: string) => {
        return t === 'sale' ? 'destructive' as const : 'secondary' as const;
    };

    return (
        <>
            <Head title="Flat Bookings" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <CalendarCheck className="size-6" />
                    <h1 className="text-2xl font-semibold">Flat Bookings</h1>
                </div>
                <Button asChild>
                    <Link href={bookings.create().url}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Booking
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by client or unit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={status} onValueChange={(v) => { setStatus(v); router.get(bookings.index().url, { search, status: v, booking_type: bookingType }, { preserveState: true, replace: true }) }}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={bookingType} onValueChange={(v) => { setBookingType(v); router.get(bookings.index().url, { search, status, booking_type: v }, { preserveState: true, replace: true }) }}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All types</SelectItem>
                                <SelectItem value="booking">Booking</SelectItem>
                                <SelectItem value="sale">Sale</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Down Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        No bookings found.
                                    </TableCell>
                                </TableRow>
                            ) : data.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">#{booking.id}</TableCell>
                                    <TableCell>
                                        <Link href={`/flat-owners/${booking.client.id}`} className="hover:underline">
                                            {booking.client.contact_person || booking.client.company_name}
                                        </Link>
                                        <div className="text-xs text-muted-foreground">{booking.client.phone_mobile}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/flats/${booking.unit.id}`} className="hover:underline">
                                            {booking.unit.unit_number}
                                        </Link>
                                        <div className="text-xs text-muted-foreground">{booking.unit.building?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={typeVariant(booking.booking_type)}>
                                            {booking.booking_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{booking.booking_date}</TableCell>
                                    <TableCell>{booking.down_payment ? `৳${Number(booking.down_payment).toLocaleString('en-US')}` : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={bookings.show(booking.id).url}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={bookings.edit(booking.id).url}>
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(booking.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {last_page > 1 && (
                        <div className="flex justify-center gap-1 mt-4">
                            {links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Bookings', href: '/bookings' },
    ],
};

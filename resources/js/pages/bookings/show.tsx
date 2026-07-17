import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import { ArrowLeft, CalendarCheck, User, Home, FileText, DollarSign } from 'lucide-react';

interface Building {
    id: number;
    name: string;
    address: string;
}

interface Unit {
    id: number;
    unit_number: string;
    building: Building;
    floor: number;
    area_sqft: number;
    price: number;
}

interface Client {
    id: number;
    contact_person: string;
    company_name: string;
    email: string;
    phone_mobile: string;
    owner_id: string;
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
    notes: string | null;
    created_at: string;
}

export default function Show({ booking }: { booking: Booking }) {
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
            <Head title={`Booking #${booking.id}`} />

            <div className="flex items-center gap-2 mb-6">
                <Link href={bookings.index().url}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <CalendarCheck className="size-6" />
                <h1 className="text-2xl font-semibold">Booking #{booking.id}</h1>
                <Badge variant={statusVariant(booking.status)} className="ml-2">
                    {booking.status}
                </Badge>
                <Badge variant={typeVariant(booking.booking_type)} className="ml-1">
                    {booking.booking_type}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-4" />
                            Client Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Owner ID</dt>
                                <dd className="font-medium">{booking.client.owner_id}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="font-medium">{booking.client.contact_person || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Company</dt>
                                <dd>{booking.client.company_name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{booking.client.email || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>{booking.client.phone_mobile || '-'}</dd>
                            </div>
                            <div className="col-span-2 mt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/flat-owners/${booking.client.id}`}>
                                        View Client Profile
                                    </Link>
                                </Button>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="size-4" />
                            Unit Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Unit Number</dt>
                                <dd className="font-medium">{booking.unit.unit_number}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Building</dt>
                                <dd>{booking.unit.building?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Floor</dt>
                                <dd>{booking.unit.floor || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Area (sqft)</dt>
                                <dd>{booking.unit.area_sqft ? `${Number(booking.unit.area_sqft).toLocaleString('en-US')} sqft` : '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Price</dt>
                                <dd>{booking.unit.price ? `৳${Number(booking.unit.price).toLocaleString('en-US')}` : '-'}</dd>
                            </div>
                            <div className="col-span-2 mt-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/flats/${booking.unit.id}`}>
                                        View Unit Details
                                    </Link>
                                </Button>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="size-4" />
                            Booking Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Booking Date</dt>
                                <dd className="font-medium">{booking.booking_date}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Down Payment</dt>
                                <dd className="font-medium">
                                    {booking.down_payment ? `৳${Number(booking.down_payment).toLocaleString('en-US')}` : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Total Price</dt>
                                <dd className="font-medium">
                                    {booking.total_price ? `৳${Number(booking.total_price).toLocaleString('en-US')}` : '-'}
                                </dd>
                            </div>
                            {booking.notes && (
                                <div className="col-span-3">
                                    <dt className="text-muted-foreground">Notes</dt>
                                    <dd className="mt-1 whitespace-pre-wrap text-sm">{booking.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 flex gap-3">
                <Button asChild>
                    <Link href={bookings.edit(booking.id).url}>
                        Edit Booking
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={bookings.index().url}>
                        Back to List
                    </Link>
                </Button>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Bookings', href: '/bookings' },
        { title: 'Details', href: '/bookings/{booking}' },
    ],
};

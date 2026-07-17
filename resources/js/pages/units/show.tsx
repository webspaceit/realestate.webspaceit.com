import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import flats from '@/routes/flats';
import { ArrowLeft, Bath, Bed, Building2, FolderGit2, Home, MapPin, Ruler } from 'lucide-react';

interface Building {
    id: number;
    code: string;
    name: string;
    address: string;
}

interface Project {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    unit_number: string;
    unit_name: string | null;
    building: Building;
    project: Project | null;
    floor: number;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    price: number;
    status: string;
    description: string;
    parking: string;
    parking_details: string | null;
    created_at: string;
}

export default function Show({ unit, bulkUnits }: { unit: Unit; bulkUnits: { id: number; unit_number: string; unit_name: string | null }[] }) {
    const statusVariant = (s: string) => {
        switch (s) {
            case 'available':
                return 'default' as const;
            case 'reserved':
            case 'under_construction':
                return 'secondary' as const;
            case 'sold':
                return 'destructive' as const;
            default:
                return 'outline' as const;
        }
    };

    const unitNumbers = unit.unit_number ? unit.unit_number.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const unitNames = unitNumbers.map((num) => {
        const match = bulkUnits.find((u) => u.unit_number === num);
        return match ? (match.unit_name || num) : num;
    }).join(', ');

    return (
        <>
            <Head title={`Flat ${unit.unit_number}`} />

            <div className="flex items-center gap-2 mb-6">
                <Link href="/flats">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <Home className="size-6" />
                <h1 className="text-2xl font-semibold">Flat {unit.unit_number}</h1>
                <Badge variant={statusVariant(unit.status)} className="ml-2">
                    {unit.status.replace(/_/g, ' ')}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Flat Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Unit Number</dt>
                                <dd className="font-mono font-medium">{unit.unit_number}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Unit Name</dt>
                                <dd className="font-medium">{unitNames || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Floor</dt>
                                <dd className="font-medium">{unit.floor}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Bedrooms</dt>
                                <dd className="font-medium flex items-center gap-1">
                                    <Bed className="size-3" /> {unit.bedrooms}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Bathrooms</dt>
                                <dd className="font-medium flex items-center gap-1">
                                    <Bath className="size-3" /> {unit.bathrooms}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Area</dt>
                                <dd className="font-medium flex items-center gap-1">
                                    <Ruler className="size-3" /> {unit.area_sqft} sqft
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Price</dt>
                                <dd className="font-medium">
                                    ৳{unit.price?.toLocaleString() ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Parking</dt>
                                <dd className="font-medium">{unit.parking === 'Available' ? (unit.parking_details || 'Available') : 'Not Available'}</dd>
                            </div>
                            {unit.description && (
                                <div className="col-span-2">
                                    <dt className="text-muted-foreground">Description</dt>
                                    <dd className="text-muted-foreground">{unit.description}</dd>
                                </div>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Building & Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Building2 className="text-muted-foreground size-4" />
                                <span className="font-medium">{unit.building?.name || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-muted-foreground size-4" />
                                <span className="text-muted-foreground text-sm">
                                    {unit.building?.address || 'No address'}
                                </span>
                            </div>
                            {unit.project && (
                                <div className="flex items-center gap-2">
                                    <FolderGit2 className="text-muted-foreground size-4" />
                                    <span className="font-medium">{unit.project.name}</span>
                                </div>
                            )}
                            {unit.building && (
                                <Link href={`/buildings/${unit.building.id}`}>
                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                        <Building2 className="size-4" />
                                        View Building
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = (props: { unit: Unit }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Flats', href: flats.index() },
        { title: props.unit.unit_number, href: flats.show(props.unit.id) },
    ],
});

import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import buildings from '@/routes/buildings';
import { ArrowLeft, Building2, Eye, Home, MapPin } from 'lucide-react';

interface Unit {
    id: number;
    unit_number: string;
    floor: number;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    price: number;
    status: string;
}

interface Building {
    id: number;
    code: string;
    name: string;
    address: string;
    status: string;
    total_floors: number;
    total_units: number;
    description: string;
    created_at: string;
    units: Unit[];
}

export default function Show({ building }: { building: Building }) {
    const statusVariant = (status: string) => {
        switch (status) {
            case 'completed':
            case 'available':
                return 'default' as const;
            case 'under_construction':
            case 'reserved':
                return 'secondary' as const;
            case 'on_hold':
            case 'sold':
                return 'destructive' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <>
            <Head title={building.name} />

            <div className="flex items-center gap-2 mb-6">
                <Link href="/buildings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <Building2 className="size-6" />
                <h1 className="text-2xl font-semibold">{building.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Building Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Code</dt>
                                <dd className="font-mono font-medium">{building.code}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Status</dt>
                                <dd>
                                    <Badge variant={statusVariant(building.status)}>
                                        {building.status.replace(/_/g, ' ')}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Total Floors</dt>
                                <dd className="font-medium">{building.total_floors}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Total Units</dt>
                                <dd className="font-medium">{building.total_units}</dd>
                            </div>
                            {building.address && (
                                <div className="col-span-2">
                                    <dt className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="size-3" /> Address
                                    </dt>
                                    <dd className="font-medium">{building.address}</dd>
                                </div>
                            )}
                            {building.description && (
                                <div className="col-span-2">
                                    <dt className="text-muted-foreground">Description</dt>
                                    <dd className="text-muted-foreground">{building.description}</dd>
                                </div>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Home className="text-muted-foreground size-5" />
                                <div>
                                    <p className="text-2xl font-bold">{building.total_units}</p>
                                    <p className="text-muted-foreground text-xs">Total Units</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="text-muted-foreground size-5" />
                                <div>
                                    <p className="text-2xl font-bold">{building.total_floors}</p>
                                    <p className="text-muted-foreground text-xs">Total Floors</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Units</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit #</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead>Bed/Bath</TableHead>
                                <TableHead>Area (sqft)</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {building.units.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-muted-foreground text-center py-8">
                                        No units for this building.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                building.units.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-mono text-xs">{unit.unit_number}</TableCell>
                                        <TableCell>{unit.floor}</TableCell>
                                        <TableCell>{unit.bedrooms}/{unit.bathrooms}</TableCell>
                                        <TableCell>{unit.area_sqft}</TableCell>
                                        <TableCell>
                                            ৳{unit.price.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(unit.status)}>
                                                {unit.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/flats/${unit.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="size-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

Show.layout = (props: { building: Building }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Buildings', href: buildings.index() },
        { title: props.building.name, href: buildings.show(props.building.id) },
    ],
});

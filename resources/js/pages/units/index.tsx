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
import flats from '@/routes/flats';
import { Eye, Home, Pencil, Plus, Search, Trash2 } from 'lucide-react';

interface BuildingRef {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    unit_number: string;
    building: BuildingRef;
    floor: number;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    price: number;
    status: string;
}

interface Filters {
    building_id?: string;
    status?: string;
    search?: string;
}

export default function Index({
    units: { data, last_page, links },
    filters,
    buildings,
}: {
    units: { data: Unit[]; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: Filters;
    buildings: { id: number; name: string }[];
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [buildingId, setBuildingId] = useState(filters.building_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(flats.index.url(), { search, building_id: buildingId, status });
    };

    const handleDelete = (unit: Unit) => {
        if (!confirm(`Delete unit "${unit.unit_number}"?`)) return;
        router.delete(`/flats/${unit.id}`, {
            onSuccess: () => toast.success('Unit deleted'),
        });
    };

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

    return (
        <>
            <Head title="Flats" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Home className="size-6" />
                    <h1 className="text-2xl font-semibold">Flats</h1>
                </div>
                <Link href="/flats/create">
                    <Button>
                        <Plus className="size-4" />
                        Add Flat
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Flats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4 mb-4">
                        <div className="relative max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search unit number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="w-48">
                            <Select value={buildingId} onValueChange={(v) => { setBuildingId(v); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Buildings" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Buildings</SelectItem>
                                    {buildings.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-40">
                            <Select value={status} onValueChange={(v) => { setStatus(v); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="under_construction">Under Construction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={applyFilters}>Search</Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit #</TableHead>
                                <TableHead>Building</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead>Bed/Bath</TableHead>
                                <TableHead>Area (sqft)</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-muted-foreground text-center py-8">
                                        No flats found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-mono text-xs">{unit.unit_number}</TableCell>
                                        <TableCell>{unit.building?.name || '-'}</TableCell>
                                        <TableCell>{unit.floor}</TableCell>
                                        <TableCell>{unit.bedrooms}/{unit.bathrooms}</TableCell>
                                        <TableCell>{unit.area_sqft}</TableCell>
                                        <TableCell>
                                            ৳{Number(unit.price).toLocaleString('en-US')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(unit.status)}>
                                                {unit.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link 
href={`/flats/${unit.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link 
href={`/flats/${unit.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(unit)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                            {links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
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
        { title: 'Dashboard', href: dashboard() },
        { title: 'Flats', href: flats.index() },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import flats from '@/routes/flats';
import { ArrowLeft, Home } from 'lucide-react';

interface Unit {
    id: number;
    building_id: number;
    project_id: number | null;
    unit_number: string;
    floor: number;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    price: number;
    status: string;
    description: string;
    parking: string;
    parking_details: string | null;
}

export default function Edit({ unit, buildings, projects, bulkUnits }: { unit: Unit; buildings: { id: number; name: string; project_id: number | null }[]; projects: { id: number; name: string }[]; bulkUnits: { id: number; unit_number: string; unit_name: string | null }[] }) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [data, setData] = useState({
        building_id: String(unit.building_id),
        project_id: String(unit.project_id || ''),
        unit_number: unit.unit_number,
        floor: unit.floor,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area_sqft: unit.area_sqft,
        price: unit.price,
        status: unit.status,
        description: unit.description || '',
        parking: unit.parking || 'Not Available',
        parking_details: unit.parking_details || '',
    });

    const filteredBuildings = data.project_id
        ? buildings.filter(b => String(b.project_id) === data.project_id)
        : buildings;

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (unit.unit_number && bulkUnits.length > 0) {
            const existingNumbers = unit.unit_number.split(',').map((s) => s.trim());
            const matched = bulkUnits.filter((u) => existingNumbers.includes(u.unit_number)).map((u) => u.id);
            setSelectedIds(matched);
        }
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleBulkUnit = (id: number, unitNumber: string) => {
        setSelectedIds((prev) => {
            let next: number[];
            if (prev.includes(id)) {
                next = prev.filter((i) => i !== id);
            } else {
                next = [...prev, id];
            }
            const selected = bulkUnits.filter((u) => next.includes(u.id));
            const numbers = selected.map((u) => u.unit_number).join(', ');
            setData((d) => ({ ...d, unit_number: numbers }));
            return next;
        });
    };

    const selectedNames = bulkUnits.filter((u) => selectedIds.includes(u.id)).map((u) => u.unit_name || u.unit_number).join(', ');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.unit_number) {
            toast.error('Select at least one unit');
            return;
        }
        setProcessing(true);
        router.put(`/flats/${unit.id}`, data, {
            onSuccess: () => {
                toast.success('Flat updated');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Edit Flat" />

            <div className="flex items-center gap-2 mb-6">
                <Link href="/flats">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <Home className="size-6" />
                <h1 className="text-2xl font-semibold">Edit Flat</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Flat Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="project_id">Project</Label>
                                <Select
                                    value={data.project_id}
                                    onValueChange={(v) => setData(prev => ({ ...prev, project_id: v, building_id: '' }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Project..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={String(project.id)}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="building_id">Building</Label>
                                <Select
                                    value={data.building_id}
                                    onValueChange={(v) => handleChange('building_id', v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={data.project_id ? 'Select Building...' : 'Select Project First...'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredBuildings.map((building) => (
                                            <SelectItem key={building.id} value={String(building.id)}>
                                                {building.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Unit Number</Label>
                                <div className="border-input min-h-[80px] rounded-md border bg-transparent p-3 text-sm">
                                    {selectedNames ? (
                                        <span className="font-medium">{selectedNames}</span>
                                    ) : (
                                        <span className="text-muted-foreground">No units selected</span>
                                    )}
                                </div>
                                {bulkUnits.length > 0 && (
                                    <div className="border-input max-h-48 overflow-y-auto rounded-md border p-2 space-y-1">
                                        {bulkUnits.map((u) => (
                                            <label key={u.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted cursor-pointer">
                                                <Checkbox
                                                    checked={selectedIds.includes(u.id)}
                                                    onCheckedChange={() => toggleBulkUnit(u.id, u.unit_number)}
                                                />
                                                <span className="font-mono text-xs">{u.unit_number}</span>
                                                {u.unit_name && <span className="text-muted-foreground">- {u.unit_name}</span>}
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {bulkUnits.length === 0 && (
                                    <p className="text-muted-foreground text-xs">No bulk units available.</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="floor">Floor</Label>
                                <Input
                                    id="floor"
                                    type="number"
                                    min={0}
                                    value={data.floor}
                                    onChange={(e) => handleChange('floor', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    min={0}
                                    value={data.bedrooms}
                                    onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    min={0}
                                    step="0.5"
                                    value={data.bathrooms}
                                    onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="area_sqft">Area (sqft)</Label>
                                <Input
                                    id="area_sqft"
                                    type="number"
                                    min={0}
                                    value={data.area_sqft}
                                    onChange={(e) => handleChange('area_sqft', Number(e.target.value))}
                                />
                            </div>
                            <div className="col-span-2 grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min={0}
                                        value={data.price}
                                        onChange={(e) => handleChange('price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parking">Parking</Label>
                                    <Select
                                        value={data.parking}
                                        onValueChange={(v) => handleChange('parking', v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Parking..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Not Available">Not Available</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {data.parking === 'Available' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="parking_details">Parking Name / Number</Label>
                                        <Input
                                            id="parking_details"
                                            value={data.parking_details}
                                            onChange={(e) => handleChange('parking_details', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => handleChange('status', v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="under_construction">Under Construction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                                value={data.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Flat'}
                            </Button>
                            <Link href="/flats">
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

Edit.layout = (props: { unit: Unit }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Flats', href: flats.index() },
        { title: 'Edit', href: flats.edit(props.unit.id) },
    ],
});

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import flats from '@/routes/flats';
import { Eye, Pencil, Plus, Search, Trash2, Layers } from 'lucide-react';

interface Unit {
    id: number;
    unit_number: string;
    created_at: string;
}

interface Filters {
    search?: string;
}

export default function BulkIndex({
    units: { data, last_page, links },
    filters,
}: {
    units: { data: Unit[]; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: Filters;
}) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = () => {
        router.get(flats.bulkIndex.url(), { search });
    };

    const handleDelete = (unit: Unit) => {
        if (!confirm(`Delete unit "${unit.unit_number}"?`)) return;
        router.delete(`/flats/${unit.id}`, {
            onSuccess: () => toast.success('Unit deleted'),
        });
    };

    return (
        <>
            <Head title="Bulk Units" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Layers className="size-6" />
                    <h1 className="text-2xl font-semibold">Bulk Units</h1>
                </div>
                <Link href="/flats/bulk-create">
                    <Button>
                        <Plus className="size-4" />
                        Add Bulk Units
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Bulk Units</CardTitle>
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
                        <Button onClick={applyFilters}>Search</Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit #</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-muted-foreground text-center py-8">
                                        No bulk units found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="font-mono text-xs">{unit.unit_number}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(unit.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/flats/${unit.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/flats/${unit.id}/edit`}>
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

BulkIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Bulk Units', href: flats.bulkIndex() },
    ],
};

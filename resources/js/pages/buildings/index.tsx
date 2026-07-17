import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import buildings from '@/routes/buildings';
import { Building2, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

interface Building {
    id: number;
    code: string;
    name: string;
    status: string;
    total_floors: number;
    total_units: number;
    created_at: string;
}

export default function Index({ buildings: { data, last_page, links } }: { buildings: { data: Building[]; last_page: number; links: { url: string | null; label: string; active: boolean }[] } }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(buildings.index.url(), { search });
    };

    const handleDelete = (building: Building) => {
        if (!confirm(`Delete building "${building.name}"?`)) return;
        router.delete(`/buildings/${building.id}`, {
            onSuccess: () => toast.success('Building deleted'),
        });
    };

    const statusVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default' as const;
            case 'under_construction':
                return 'secondary' as const;
            case 'on_hold':
                return 'destructive' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <>
            <Head title="Buildings" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Building2 className="size-6" />
                    <h1 className="text-2xl font-semibold">Buildings</h1>
                </div>
                <Link href="/buildings/create">
                    <Button>
                        <Plus className="size-4" />
                        Add Building
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Buildings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative max-w-sm">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search by name or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </form>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Floors</TableHead>
                                <TableHead className="text-center">Units</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground text-center py-8">
                                        No buildings found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((building) => (
                                    <TableRow key={building.id}>
                                        <TableCell className="font-mono text-xs">{building.code}</TableCell>
                                        <TableCell className="font-medium">{building.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(building.status)}>
                                                {building.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">{building.total_floors}</TableCell>
                                        <TableCell className="text-center">{building.total_units}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/buildings/${building.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/buildings/${building.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(building)}>
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
        { title: 'Buildings', href: buildings.index() },
    ],
};

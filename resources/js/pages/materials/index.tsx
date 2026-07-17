import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import materials from '@/routes/materials';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

interface Material {
    id: number;
    name: string;
    sku: string;
    description: string;
    unit: string;
    unit_price: number;
    category: string;
}

interface PageProps {
    materials: { data: Material[]; current_page: number; last_page: number; per_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string; category?: string };
}

export default function Index() {
    const { materials: materialsData, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    function applyFilters() {
        router.get(materials.index().url, { search, category }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(material: Material) {
        if (!confirm(`Delete material "${material.name}"?`)) return;
        router.delete(materials.destroy(material.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Material deleted'),
        });
    }

    return (
        <>
            <Head title="Materials" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Materials</h1>
                    <Link href={materials.create().url}>
                        <Button><Plus className="mr-2 h-4 w-4" />Add Material</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search name or SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            <Select value={category} onValueChange={(v) => { setCategory(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All categories</SelectItem>
                                    <SelectItem value="raw materials">Raw Materials</SelectItem>
                                    <SelectItem value="finishing">Finishing</SelectItem>
                                    <SelectItem value="electrical">Electrical</SelectItem>
                                    <SelectItem value="plumbing">Plumbing</SelectItem>
                                    <SelectItem value="hardware">Hardware</SelectItem>
                                    <SelectItem value="tools">Tools</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={applyFilters}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materialsData.data.map((material) => (
                                    <TableRow key={material.id}>
                                        <TableCell className="font-medium">{material.name}</TableCell>
                                        <TableCell>{material.sku}</TableCell>
                                        <TableCell>{material.unit}</TableCell>
                                        <TableCell>৳{Number(material.unit_price).toLocaleString()}</TableCell>
                                        <TableCell>{material.category}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={materials.show(material.id).url}>
                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                </Link>
                                                <Link href={materials.edit(material.id).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(material)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {materialsData.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No materials found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {materialsData.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {materialsData.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Materials', href: materials.index().url },
    ],
};

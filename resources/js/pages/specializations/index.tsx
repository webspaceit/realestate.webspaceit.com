import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import specializations from '@/routes/specializations';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

interface Specialization {
    id: number;
    name: string;
    created_at: string;
}

interface PageProps {
    specializations: { data: Specialization[]; current_page: number; last_page: number; per_page: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string };
}

export default function Index() {
    const { specializations: data, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');

    function applyFilters() {
        router.get(specializations.index().url, { search }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(specialization: Specialization) {
        if (!confirm(`Delete specialization "${specialization.name}"?`)) return;
        router.delete(specializations.destroy(specialization.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Specialization deleted'),
        });
    }

    return (
        <>
            <Head title="Specializations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Specializations</h1>
                    <Link href={specializations.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Specialization
                        </Button>
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
                                    placeholder="Search specialization..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
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
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((specialization) => (
                                    <TableRow key={specialization.id}>
                                        <TableCell className="font-medium">{specialization.name}</TableCell>
                                        <TableCell>{new Date(specialization.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={specializations.show(specialization.id).url}>
                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                </Link>
                                                <Link href={specializations.edit(specialization.id).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(specialization)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                            No specializations found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {data.links.map((link, i) => (
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
        { title: 'Specializations', href: specializations.index().url },
    ],
};

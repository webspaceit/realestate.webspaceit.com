import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import subcategories from '@/routes/subcategories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    document_category_id: number;
    order: number;
    created_at: string;
    category: Category;
}

interface PageProps {
    subcategories: { data: Subcategory[]; current_page: number; last_page: number; per_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string; document_category_id?: string; per_page?: string };
    categories: Category[];
}

export default function Index() {
    const { subcategories: data, filters, categories } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.document_category_id || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');

    function applyFilters() {
        router.get(subcategories.index().url, { search, document_category_id: categoryFilter, per_page: perPage }, { preserveState: true, preserveScroll: true });
    }

    function resetFilters() {
        setSearch('');
        setCategoryFilter('');
        setPerPage('10');
        router.get(subcategories.index().url, { search: '', document_category_id: '', per_page: '10' }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(sub: Subcategory) {
        if (!confirm(`Delete subcategory "${sub.name}"?`)) return;
        router.delete(subcategories.destroy(sub.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Subcategory deleted'),
        });
    }

    return (
        <>
            <Head title="Sub Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sub Categories</h1>
                    <Link href={subcategories.create().url}>
                        <Button><Plus className="mr-2 h-4 w-4" />Add Sub Category</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
                            </div>
                            <div className="w-48">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Categories</SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-28">
                                <Select value={perPage} onValueChange={setPerPage}>
                                    <SelectTrigger id="per_page">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                        <SelectItem value="150">150</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button variant="outline" onClick={applyFilters}><Search className="mr-2 h-4 w-4" />Search</Button>
                                <Button variant="outline" onClick={resetFilters}><RotateCcw className="mr-1 h-4 w-4" />Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Sl.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No subcategories found.</TableCell></TableRow>
                                ) : (
                                    data.data.map((sub, i) => (
                                        <TableRow key={sub.id}>
                                            <TableCell className="text-muted-foreground">{(data.from ?? 0) + i}</TableCell>
                                            <TableCell className="font-medium">{sub.name}</TableCell>
                                            <TableCell>{sub.category?.name || '-'}</TableCell>
                                            <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={subcategories.show(sub.id).url}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                                                    <Link href={subcategories.edit(sub.id).url}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sub)}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing {data.from ?? 0} to {data.to ?? 0} of {data.total}</p>
                </div>

                {data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {data.links.map((link, i) => (
                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
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
        { title: 'Sub Categories', href: subcategories.index().url },
    ],
};

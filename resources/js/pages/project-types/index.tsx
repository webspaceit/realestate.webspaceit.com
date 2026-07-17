import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import projectTypes from '@/routes/project-types';
import { GripVertical, ListTree, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

export default function Index({
    projectTypes: { data: initialData, last_page, links },
    filters,
}: {
    projectTypes: { data: ProjectType[]; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [items, setItems] = useState(initialData);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(projectTypes.index().url, { search }, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure?')) return;
        router.delete(projectTypes.destroy(id).url, {
            onSuccess: () => toast.success('Project Type deleted'),
        });
    }

    function handleDragStart(index: number) {
        dragItem.current = index;
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        dragOverItem.current = index;
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop() {
        if (dragItem.current === null || dragOverItem.current === null) return;
        if (dragItem.current === dragOverItem.current) return;

        const updated = [...items];
        const dragged = updated.splice(dragItem.current, 1)[0];
        updated.splice(dragOverItem.current, 0, dragged);
        setItems(updated);

        const ids = updated.map(i => i.id);
        fetch(projectTypes.reorder().url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' },
            body: JSON.stringify({ ids }),
        }).then(() => toast.success('Order updated'));

        dragItem.current = null;
        dragOverItem.current = null;
    }

    function handleDragEnd() {
        dragItem.current = null;
        dragOverItem.current = null;
    }

    return (
        <>
            <Head title="Project Types" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ListTree className="size-6" />
                    <h1 className="text-2xl font-semibold">Project Types</h1>
                </div>
                <Button asChild>
                    <Link href={projectTypes.create().url}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project Type
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Project Types (drag rows to reorder)</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search project types..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No project types found.</TableCell>
                                </TableRow>
                            ) : items.map((pt, index) => (
                                <TableRow
                                    key={pt.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                    className={dragOverItem.current === index ? 'border-primary' : ''}
                                >
                                    <TableCell className="cursor-grab active:cursor-grabbing">
                                        <GripVertical className="size-4 text-muted-foreground" />
                                    </TableCell>
                                    <TableCell className="font-medium">{pt.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{pt.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={pt.is_active ? 'default' : 'secondary'}>
                                            {pt.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={projectTypes.show(pt.id).url}><Eye className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={projectTypes.edit(pt.id).url}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(pt.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {last_page > 1 && (
                        <div className="flex justify-center gap-1 mt-4">
                            {links.map((link, i) => (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
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
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Project Types', href: '/project-types' },
    ],
};

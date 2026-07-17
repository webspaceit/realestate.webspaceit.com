import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import categories from '@/routes/document-categories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface DocumentCategory {
    id: number;
    name: string;
    order: number;
    created_at: string;
}

interface PageProps {
    categories: { data: DocumentCategory[]; current_page: number; last_page: number; per_page: number; from: number };
    filters: { search?: string };
}

function SortableRow({ cat, slNo }: { cat: DocumentCategory; slNo: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    function handleDelete() {
        if (!confirm(`Delete category "${cat.name}"?`)) return;
        router.delete(categories.destroy(cat.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Category deleted'),
        });
    }

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-8 text-muted-foreground">{slNo}</TableCell>
            <TableCell className="w-8">
                <button {...attributes} {...listeners} className="cursor-grab touch-none" type="button">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
            </TableCell>
            <TableCell className="font-medium">{cat.name}</TableCell>
            <TableCell>{new Date(cat.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Link href={categories.show(cat.id).url}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                    <Link href={categories.edit(cat.id).url}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function Index() {
    const { categories: data, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [items, setItems] = useState(data.data.map((c) => c.id));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    function applyFilters() {
        router.get(categories.index().url, { search }, { preserveState: true, preserveScroll: true });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, active.id as number);
        setItems(newItems);

        router.post(categories.reorder().url, { ids: newItems }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Order updated'),
        });
    }

    return (
        <>
            <Head title="Document Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Document Categories</h1>
                    <Link href={categories.create().url}>
                        <Button><Plus className="mr-2 h-4 w-4" />Add Category</Button>
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
                            <Button variant="outline" onClick={applyFilters}><Search className="mr-2 h-4 w-4" />Search</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Sl.</TableHead>
                                    <TableHead className="w-8"></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                        {items.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No categories found.</TableCell></TableRow>
                                        ) : (
                                            items.map((id, i) => {
                                                const cat = data.data.find((c) => c.id === id)!;
                                                return <SortableRow key={cat.id} cat={cat} slNo={(data.from ?? 0) + i} />;
                                            })
                                        )}
                                    </SortableContext>
                                </DndContext>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
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
        { title: 'Categories', href: categories.index().url },
    ],
};

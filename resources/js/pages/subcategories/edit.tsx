import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import subcategories from '@/routes/subcategories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    document_category_id: number;
}

export default function Edit() {
    const { subcategory, categories } = usePage<{ subcategory: Subcategory; categories: Category[] }>().props;
    const [form, setForm] = useState({ name: subcategory.name, document_category_id: String(subcategory.document_category_id) });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(subcategories.update(subcategory.id).url, form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Subcategory updated'); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Edit Sub Category" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={subcategories.index().url}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-bold">Edit Sub Category</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Sub Category Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Main Category</Label>
                                <Select value={form.document_category_id} onValueChange={(v) => setForm({ ...form, document_category_id: v })}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={subcategories.index().url}><Button variant="outline" type="button">Cancel</Button></Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Edit.layout = (props: { subcategory: Subcategory }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Sub Categories', href: subcategories.index().url },
        { title: 'Edit', href: subcategories.edit(props.subcategory.id).url },
    ],
});

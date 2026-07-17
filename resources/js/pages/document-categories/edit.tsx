import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import categories from '@/routes/document-categories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DocumentCategory {
    id: number;
    name: string;
}

export default function Edit() {
    const { documentCategory } = usePage<{ documentCategory: DocumentCategory }>().props;
    const [form, setForm] = useState({ name: documentCategory.name });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(categories.update(documentCategory.id).url, form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Category updated'); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Edit Category" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={categories.index().url}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-bold">Edit Category</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={categories.index().url}><Button variant="outline" type="button">Cancel</Button></Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Edit.layout = (props: { documentCategory: DocumentCategory }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Categories', href: categories.index().url },
        { title: 'Edit', href: categories.edit(props.documentCategory.id).url },
    ],
});

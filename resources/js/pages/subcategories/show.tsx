import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import subcategories from '@/routes/subcategories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    created_at: string;
    category: Category;
}

export default function Show() {
    const { subcategory } = usePage<{ subcategory: Subcategory }>().props;

    return (
        <>
            <Head title={subcategory.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={subcategories.index().url}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-bold">{subcategory.name}</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Sub Category Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{subcategory.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Main Category</p>
                            <p className="font-medium">{subcategory.category?.name || '-'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(subcategory.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-2">
                    <Link href={subcategories.edit(subcategory.id).url}><Button>Edit Sub Category</Button></Link>
                    <Link href={subcategories.index().url}><Button variant="outline">Back</Button></Link>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Sub Categories', href: subcategories.index().url },
        { title: 'Show', href: '' },
    ],
};

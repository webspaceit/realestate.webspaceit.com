import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import categories from '@/routes/document-categories';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentCategory {
    id: number;
    name: string;
    created_at: string;
}

export default function Show() {
    const { documentCategory } = usePage<{ documentCategory: DocumentCategory }>().props;

    return (
        <>
            <Head title={documentCategory.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={categories.index().url}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-bold">{documentCategory.name}</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{documentCategory.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(documentCategory.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-2">
                    <Link href={categories.edit(documentCategory.id).url}><Button>Edit Category</Button></Link>
                    <Link href={categories.index().url}><Button variant="outline">Back</Button></Link>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Categories', href: categories.index().url },
        { title: 'Show', href: '' },
    ],
};

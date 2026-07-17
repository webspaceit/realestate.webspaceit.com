import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import specializations from '@/routes/specializations';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Specialization {
    id: number;
    name: string;
    created_at: string;
}

export default function Show() {
    const { specialization } = usePage<{ specialization: Specialization }>().props;

    return (
        <>
            <Head title={specialization.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={specializations.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{specialization.name}</h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Specialization Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{specialization.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(specialization.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-2">
                    <Link href={specializations.edit(specialization.id).url}>
                        <Button>Edit Specialization</Button>
                    </Link>
                    <Link href={specializations.index().url}>
                        <Button variant="outline">Back to Specializations</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Specializations', href: specializations.index().url },
        { title: 'Show', href: '' },
    ],
};

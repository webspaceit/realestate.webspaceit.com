import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import projectTypes from '@/routes/project-types';
import { ArrowLeft, ListTree } from 'lucide-react';

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

export default function Show({ projectType }: { projectType: ProjectType }) {
    return (
        <>
            <Head title={projectType.name} />

            <div className="flex items-center gap-2 mb-6">
                <Link href={projectTypes.index().url}>
                    <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
                </Link>
                <ListTree className="size-6" />
                <h1 className="text-2xl font-semibold">{projectType.name}</h1>
                <Badge variant={projectType.is_active ? 'default' : 'secondary'} className="ml-2">
                    {projectType.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Type Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground">Name</dt>
                            <dd className="font-medium">{projectType.name}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Slug</dt>
                            <dd className="font-mono text-xs">{projectType.slug}</dd>
                        </div>
                        {projectType.description && (
                            <div className="col-span-2">
                                <dt className="text-muted-foreground">Description</dt>
                                <dd className="mt-1">{projectType.description}</dd>
                            </div>
                        )}
                    </dl>
                </CardContent>
            </Card>

            <div className="mt-6 flex gap-3">
                <Button asChild>
                    <Link href={projectTypes.edit(projectType.id).url}>Edit</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={projectTypes.index().url}>Back to List</Link>
                </Button>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Project Types', href: '/project-types' },
        { title: 'Details', href: '/project-types/{projectType}' },
    ],
};

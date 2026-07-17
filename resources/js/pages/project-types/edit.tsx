import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import projectTypes from '@/routes/project-types';
import { ArrowLeft, ListTree } from 'lucide-react';

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

export default function Edit({ projectType }: { projectType: ProjectType }) {
    const [name, setName] = useState(projectType.name);
    const [slug, setSlug] = useState(projectType.slug);
    const [description, setDescription] = useState(projectType.description || '');
    const [isActive, setIsActive] = useState(projectType.is_active);
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(projectTypes.update(projectType.id).url, { name, slug, description: description || null, is_active: isActive }, {
            preserveState: true,
            onSuccess: () => toast.success('Project Type updated'),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Edit Project Type" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={projectTypes.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Project Types
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Project Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Description</Label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update'}</Button>
                            <Button variant="outline" asChild><Link href={projectTypes.index().url}>Cancel</Link></Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Project Types', href: '/project-types' },
        { title: 'Edit', href: '/project-types/{projectType}/edit' },
    ],
};

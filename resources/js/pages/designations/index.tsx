import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import designations from '@/routes/designations';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Designation {
    id: number;
    name: string;
    code: string | null;
    level: string | null;
    status: string;
    employees_count: number;
    department: { id: number; name: string } | null;
}

interface DepartmentOpt {
    id: number;
    name: string;
}

interface PageProps {
    designations: { data: Designation[]; current_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    departments: DepartmentOpt[];
    filters: { search?: string; department_id?: string; status?: string };
}

export default function Index() {
    const { designations: data, departments, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || ' ');
    const [status, setStatus] = useState(filters.status || '');

    function applyFilters() {
        router.get(designations.index().url, {
            search,
            department_id: departmentId === ' ' ? '' : departmentId,
            status,
        }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(designation: Designation) {
        if (!confirm(`Delete designation "${designation.name}"?`)) return;
        router.delete(designations.destroy(designation.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Designation deleted'),
        });
    }

    return (
        <>
            <Head title="Designations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Designations</h1>
                    <Link href={designations.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Designation
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search name or code..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            <Select value={departmentId} onValueChange={(v) => { setDepartmentId(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="All departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All departments</SelectItem>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={status} onValueChange={(v) => { setStatus(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={applyFilters}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Employees</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((designation) => (
                                    <TableRow key={designation.id}>
                                        <TableCell className="font-medium">{designation.name}</TableCell>
                                        <TableCell>{designation.department?.name || '-'}</TableCell>
                                        <TableCell>{designation.code || '-'}</TableCell>
                                        <TableCell>{designation.employees_count}</TableCell>
                                        <TableCell>
                                            <Badge variant={designation.status === 'active' ? 'default' : 'secondary'}>
                                                {designation.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={designations.edit(designation.id).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(designation)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No designations found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {data.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
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
        { title: 'Designations', href: designations.index().url },
    ],
};
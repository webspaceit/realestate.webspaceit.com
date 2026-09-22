import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    photo: string | null;
    mobile: string | null;
    email: string | null;
    status: string;
    department: { id: number; name: string } | null;
    designation: { id: number; name: string } | null;
}

interface Option {
    id: number;
    name: string;
}

interface PageProps {
    employees: { data: Employee[]; current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null; links: { url: string | null; label: string; active: boolean }[] };
    departments: Option[];
    designations: Option[];
    filters: { search?: string; department_id?: string; designation_id?: string; status?: string; per_page?: string };
}

const PER_PAGE_OPTIONS = ['10', '25', '50', '100'];

export default function Index() {
    const { employees: data, departments, designations, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || ' ');
    const [designationId, setDesignationId] = useState(filters.designation_id || ' ');
    const [status, setStatus] = useState(filters.status || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');

    function applyFilters() {
        router.get(employees.index().url, {
            search,
            department_id: departmentId === ' ' ? '' : departmentId,
            designation_id: designationId === ' ' ? '' : designationId,
            status,
            per_page: perPage,
        }, { preserveState: true, preserveScroll: true });
    }

    function changePerPage(value: string) {
        setPerPage(value);
        router.get(employees.index().url, {
            search,
            department_id: departmentId === ' ' ? '' : departmentId,
            designation_id: designationId === ' ' ? '' : designationId,
            status,
            per_page: value,
        }, { preserveState: true, preserveScroll: true });
    }

    function handleDelete(employee: Employee) {
        if (!confirm(`Delete employee "${employee.full_name}"?`)) return;
        router.delete(employees.destroy(employee.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Employee deleted'),
        });
    }

    return (
        <>
            <Head title="List of Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">List of Employee</h1>
                    <Link href={employees.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
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
                                    placeholder="Search ID, name, email or mobile..."
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
                            <Select value={designationId} onValueChange={(v) => { setDesignationId(v); setTimeout(applyFilters); }}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="All designations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All designations</SelectItem>
                                    {designations.map((d) => (
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
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            {employee.photo ? (
                                                <img src={`/files/${employee.photo}`} alt={employee.full_name} className="h-9 w-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-muted" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{employee.employee_id}</TableCell>
                                        <TableCell>{employee.full_name}</TableCell>
                                        <TableCell>{employee.department?.name || '-'}</TableCell>
                                        <TableCell>{employee.designation?.name || '-'}</TableCell>
                                        <TableCell>{employee.mobile || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                                {employee.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={employees.show(employee.id).url}>
                                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                </Link>
                                                <Link href={employees.edit(employee.id).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(employee)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {data.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {data.last_page > 1 || data.total > 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {data.total > 0
                                    ? `Showing ${data.from ?? 0}–${data.to ?? 0} of ${data.total}`
                                    : 'No results'}
                            </span>
                            <Select value={perPage} onValueChange={changePerPage}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Per page" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PER_PAGE_OPTIONS.map((size) => (
                                        <SelectItem key={size} value={size}>{size} / page</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {data.last_page > 1 && (
                            <div className="flex items-center gap-2">
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
                ) : null}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'List of Employee', href: employees.index().url },
    ],
};
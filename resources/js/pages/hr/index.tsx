import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import hr from '@/routes/hr';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export interface HrField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'month' | 'select' | 'employee' | 'department' | 'designation' | 'file';
    required?: boolean;
    options?: string[];
}

export interface HrModule {
    key: string;
    title: string;
    fields: HrField[];
    columns: string[];
}

interface HrRecordRow {
    id: number;
    employee_id: number | null;
    title: string | null;
    description: string | null;
    date: string | null;
    amount: string | null;
    status: string | null;
    file: string | null;
    data: Record<string, unknown> | null;
}

interface PageProps {
    module: HrModule;
    records: { data: HrRecordRow[]; current_page: number; last_page: number; links: { url: string | null; label: string; active: boolean }[] };
    employeesMap: Record<string, string>;
    departmentsMap: Record<string, string>;
    designationsMap: Record<string, string>;
    filters: { search?: string; status?: string; employee_id?: string };
}

function fmtValue(value: string | null | undefined, type?: string): string {
    if (value === null || value === undefined || value === '') return '-';
    if (type === 'date') return String(value).slice(0, 10);
    if (type === 'month') {
        const [y, m] = String(value).split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return m && y ? `${months[Number(m) - 1]} ${y}` : String(value);
    }
    return String(value);
}

function statusVariant(status: string | null): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (!status) return 'secondary';
    const positive = ['Active', 'Approved', 'Completed', 'Paid', 'Present', 'Published', 'Open', 'Processed', 'Resolved', 'Won'];
    const negative = ['Rejected', 'Closed', 'Lost', 'Inactive', 'Absent', 'Suspended'];
    if (positive.includes(status)) return 'default';
    if (negative.includes(status)) return 'destructive';
    return 'secondary';
}

export default function Index() {
    const { module, records, employeesMap, departmentsMap, designationsMap, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const fieldMap = Object.fromEntries(module.fields.map((f) => [f.key, f]));

    function applyFilters() {
        router.get(hr.index(module.key).url, { search, status }, { preserveState: true, preserveScroll: true });
    }

    function resolveValue(field: HrField, record: HrRecordRow): string {
        if (field.type === 'employee') {
            return record.employee_id ? (employeesMap[record.employee_id] ?? '-') : '-';
        }
        if (field.type === 'department') {
            const id = record.data?.[field.key];
            return id ? (departmentsMap[String(id)] ?? '-') : '-';
        }
        if (field.type === 'designation') {
            const id = record.data?.[field.key];
            return id ? (designationsMap[String(id)] ?? '-') : '-';
        }
        if (field.type === 'file') {
            return record.file ? 'Uploaded' : '-';
        }
        const base = (record as unknown as Record<string, unknown>)[field.key];
        const raw = base !== undefined && base !== null ? String(base) : (record.data?.[field.key] != null ? String(record.data[field.key]) : null);
        return fmtValue(raw, field.type);
    }

    function handleDelete(record: HrRecordRow) {
        if (!confirm(`Delete this ${module.title.toLowerCase()} record?`)) return;
        router.delete(hr.destroy({ module: module.key, record: record.id }).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success(`${module.title} deleted`),
        });
    }

    return (
        <>
            <Head title={module.title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{module.title}</h1>
                    <Link href={hr.create(module.key).url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add {module.title}
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
                                    placeholder={`Search ${module.title.toLowerCase()}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
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
                                    {module.columns.map((key) => (
                                        <TableHead key={key}>{fieldMap[key]?.label ?? key}</TableHead>
                                    ))}
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.map((record) => (
                                    <TableRow key={record.id}>
                                        {module.columns.map((key) => {
                                            const field = fieldMap[key];
                                            return <TableCell key={key}>{resolveValue(field, record)}</TableCell>;
                                        })}
                                        <TableCell>
                                            <Badge variant={statusVariant(record.status)}>{record.status || '-'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {record.file ? (
                                                    <a href={`/files/${record.file}`} target="_blank" rel="noreferrer" title="Preview attachment">
                                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                    </a>
                                                ) : (
                                                    <Button variant="ghost" size="icon" disabled><Eye className="h-4 w-4 opacity-40" /></Button>
                                                )}
                                                <Link href={hr.edit({ module: module.key, record: record.id }).url}>
                                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(record)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {records.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={module.columns.length + 2} className="py-8 text-center text-muted-foreground">
                                            No records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {records.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {records.links.map((link, i) => (
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
        { title: 'List of Employee', href: employees.index().url },
    ],
};
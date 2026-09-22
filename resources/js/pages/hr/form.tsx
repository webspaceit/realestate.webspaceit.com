import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import hr from '@/routes/hr';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';
import type { HrField, HrModule } from './index';

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

interface HrFormProps {
    module: HrModule;
    existing?: HrRecordRow | null;
    employeesMap: Record<string, string>;
    departmentsMap: Record<string, string>;
    designationsMap: Record<string, string>;
}

const inputClass = 'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring';

interface FieldControlProps {
    field: HrField;
    value: string;
    employeeOptions: { value: string; label: string }[];
    departmentOptions: { value: string; label: string }[];
    designationOptions: { value: string; label: string }[];
    onChange: (v: string) => void;
    onFile?: (f: File | null) => void;
}

function FieldControl({ field, value, employeeOptions, departmentOptions, designationOptions, onChange, onFile }: FieldControlProps) {
    const requiredMark = field.required ? <span className="text-destructive"> *</span> : null;

    switch (field.type) {
        case 'textarea':
            return (
                <div className="space-y-2">
                    <Label>{field.label}{requiredMark}</Label>
                    <textarea value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} rows={3} />
                </div>
            );
        case 'select':
            return (
                <div className="space-y-2">
                    <Label>{field.label}{requiredMark}</Label>
                    <Select value={value} onValueChange={(v) => onChange(v === ' ' ? '' : v)}>
                        <SelectTrigger><SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value=" ">—</SelectItem>
                            {(field.options ?? []).map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        case 'employee':
        case 'department':
        case 'designation': {
            const options = field.type === 'employee' ? employeeOptions : field.type === 'department' ? departmentOptions : designationOptions;
            return (
                <div className="space-y-2">
                    <Label>{field.label}{requiredMark}</Label>
                    <SearchableSelect
                        label=""
                        placeholder={`Select ${field.label.toLowerCase()}...`}
                        options={options}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            );
        }
        case 'file':
            return (
                <div className="space-y-2">
                    <Label>{field.label}{requiredMark}</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onFile?.(e.target.files?.[0] || null)} />
                    {value && (
                        <a href={`/files/${value}`} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                            View current attachment
                        </a>
                    )}
                </div>
            );
        default:
            return (
                <div className="space-y-2">
                    <Label>{field.label}{requiredMark}</Label>
                    <Input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : field.type === 'month' ? 'month' : 'text'}
                        step={field.type === 'number' ? '0.01' : undefined}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            );
    }
}

export default function HrForm({ module, existing, employeesMap, departmentsMap, designationsMap }: HrFormProps) {
    const blank = Object.fromEntries(module.fields.map((f) => [f.key, ''])) as Record<string, string>;

    const [values, setValues] = useState<Record<string, string>>(() => {
        if (!existing) return blank;
        const out = { ...blank };
        for (const field of module.fields) {
            const col = field.type === 'employee' ? 'employee_id' : field.type === 'file' ? 'file' : field.key;
            const base = (existing as unknown as Record<string, unknown>)[col];
            if (base !== undefined && base !== null) {
                out[field.key] = String(base);
            } else if (existing.data?.[field.key] != null) {
                out[field.key] = String(existing.data[field.key]);
            }
        }
        return out;
    });
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [processing, setProcessing] = useState(false);

    const employeeOptions = Object.entries(employeesMap).map(([id, name]) => ({ value: id, label: name }));
    const departmentOptions = Object.entries(departmentsMap).map(([id, name]) => ({ value: id, label: name }));
    const designationOptions = Object.entries(designationsMap).map(([id, name]) => ({ value: id, label: name }));

    function set(key: string, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const payload: Record<string, unknown> = { ...values };
        // Only send the file when a new one is selected so updates don't wipe it.
        if (module.fields.some((f) => f.type === 'file')) {
            const fileKey = module.fields.find((f) => f.type === 'file')!.key;
            if (files[fileKey]) payload[fileKey] = files[fileKey];
        }

        const options = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(existing ? `${module.title} updated` : `${module.title} created`);
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        };

        if (existing) {
            router.put(hr.update({ module: module.key, record: existing.id }).url, payload as never, options);
        } else {
            router.post(hr.store(module.key).url, payload as never, options);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {module.fields.map((field) => (
                            <FieldControl
                                key={field.key}
                                field={field}
                                value={values[field.key] ?? ''}
                                employeeOptions={employeeOptions}
                                departmentOptions={departmentOptions}
                                designationOptions={designationOptions}
                                onChange={(v) => set(field.key, v)}
                                onFile={(f) => setFiles((prev) => ({ ...prev, [field.key]: f }))}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                <Button variant="outline" type="button" onClick={() => router.get(hr.index(module.key).url)}>Cancel</Button>
            </div>
        </form>
    );
}
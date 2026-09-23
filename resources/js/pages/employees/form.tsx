import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { PartyPopper, GraduationCap, Briefcase, Paperclip } from 'lucide-react';
import employees from '@/routes/employees';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

interface Option {
    id: number;
    name: string;
}

export interface EmployeeFields {
    employee_id: string;
    full_name: string;
    father_name: string;
    mother_name: string;
    email: string;
    mobile: string;
    emergency_mobile: string;
    dob: string;
    present_address: string;
    permanent_address: string;
    marital_status: string;
    passport_no: string;
    blood_group: string;
    gender: string;
    age: string;
    religion: string;
    national_id: string;
    nationality: string;
    status: string;
    date_of_joining: string;
    position_applied_for: string;
    department_id: string;
    designation_id: string;
    designation_level: string;
    employment_type: string;
    monthly_salary: string;
    functional_superior_name: string;
    highest_degree: string;
    institution: string;
    passing_year: string;
    cgpa: string;
}

interface EmployeeFormProps {
    existing?: Record<string, unknown> | null;
    departments: Option[];
    designations: Option[];
    countries: string[];
}

const FILE_KEYS = ['certificate_1', 'certificate_2', 'certificate_3', 'certificate_4', 'certificate_5', 'certificate_6'] as const;

function fileUrl(path: string | null | undefined): string | null {
    return path ? `/files/${path}` : null;
}

export default function EmployeeForm({ existing, departments, designations, countries }: EmployeeFormProps) {
    const blank: EmployeeFields = {
        employee_id: '', full_name: '', father_name: '', mother_name: '', email: '', mobile: '',
        emergency_mobile: '', dob: '', present_address: '', permanent_address: '', marital_status: '',
        passport_no: '', blood_group: '', gender: '', age: '', religion: '', national_id: '',
        nationality: '', status: 'active', date_of_joining: '', position_applied_for: '',
        department_id: '', designation_id: '', designation_level: '', employment_type: '',
        monthly_salary: '', functional_superior_name: '', highest_degree: '', institution: '',
        passing_year: '', cgpa: '',
    };

    const [form, setForm] = useState<EmployeeFields>(() => {
        if (!existing) return blank;
        const e = existing as Record<string, unknown>;
        const out = { ...blank };
        (Object.keys(blank) as (keyof EmployeeFields)[]).forEach((key) => {
            const v = e[key];
            if (v !== null && v !== undefined) out[key] = String(v);
        });
        return out;
    });

    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [photPreview, setPhotoPreview] = useState<string | null>(existing?.photo ? fileUrl(String(existing.photo)) : null);
    const [processing, setProcessing] = useState(false);

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function setFile(key: string, file: File | null) {
        setFiles((prev) => ({ ...prev, [key]: file }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            ...form,
            photo: files.photo ?? null,
            certificate_1: files.certificate_1 ?? null,
            certificate_2: files.certificate_2 ?? null,
            certificate_3: files.certificate_3 ?? null,
            certificate_4: files.certificate_4 ?? null,
            certificate_5: files.certificate_5 ?? null,
            certificate_6: files.certificate_6 ?? null,
        };

        const options = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(existing ? 'Employee updated' : 'Employee created');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        };

        if (existing) {
            router.put(employees.update(Number(existing.id)).url, payload, options);
        } else {
            router.post(employees.store().url, payload, options);
        }
    }

    const input = 'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ---- 1. Personal Information ---- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PartyPopper className="h-4 w-4" /> Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Employee ID</Label>
                            <Input id="employee_id" value={form.employee_id} onChange={(e) => set('employee_id', e.target.value)} placeholder="Unique ID" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="father_name">Father's Name</Label>
                            <Input id="father_name" value={form.father_name} onChange={(e) => set('father_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mother_name">Mother's Name</Label>
                            <Input id="mother_name" value={form.mother_name} onChange={(e) => set('mother_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input id="mobile" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency_mobile">Emergency Mobile Number</Label>
                            <Input id="emergency_mobile" value={form.emergency_mobile} onChange={(e) => set('emergency_mobile', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Marital Status</Label>
                            <Select value={form.marital_status || undefined} onValueChange={(v) => set('marital_status', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Marital Status..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unmarried">Unmarried</SelectItem>
                                    <SelectItem value="married">Married</SelectItem>
                                    <SelectItem value="divorced">Divorced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passport_no">Passport No (If any)</Label>
                            <Input id="passport_no" value={form.passport_no} onChange={(e) => set('passport_no', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Blood Group</Label>
                            <Select value={form.blood_group || undefined} onValueChange={(v) => set('blood_group', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Blood Group..." /></SelectTrigger>
                                <SelectContent>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                        <SelectItem key={bg} value={bg}>{bg} ({bg.includes('+') ? 'Positive' : 'Negative'})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={form.gender || undefined} onValueChange={(v) => set('gender', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Gender..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="transgender">Transgender</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" min={0} value={form.age} onChange={(e) => set('age', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Religion</Label>
                            <Select value={form.religion || undefined} onValueChange={(v) => set('religion', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Religion..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="islam">Islam</SelectItem>
                                    <SelectItem value="hinduism">Hinduism</SelectItem>
                                    <SelectItem value="christianity">Christianity</SelectItem>
                                    <SelectItem value="buddhism">Buddhism</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="national_id">National ID</Label>
                            <Input id="national_id" value={form.national_id} onChange={(e) => set('national_id', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <SearchableSelect
                                label=""
                                placeholder="Select Nationality..."
                                options={countries.map((c) => ({ value: c, label: c }))}
                                value={form.nationality}
                                onChange={(v) => set('nationality', v)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Employee Status</Label>
                            <Select value={form.status || undefined} onValueChange={(v) => set('status', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Employee Status..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="present_address">Present Address</Label>
                            <textarea id="present_address" value={form.present_address} onChange={(e) => set('present_address', e.target.value)} className={input} rows={3} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="permanent_address">Permanent Address</Label>
                            <textarea id="permanent_address" value={form.permanent_address} onChange={(e) => set('permanent_address', e.target.value)} className={input} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">Photo</Label>
                            <Input id="photo" type="file" accept="image/*" onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                setFiles((prev) => ({ ...prev, photo: f }));
                                if (f) setPhotoPreview(URL.createObjectURL(f));
                            }} />
                            {photPreview && (
                                <a href={photPreview} target="_blank" rel="noreferrer" className="inline-block">
                                    <img src={photPreview} alt="Photo preview" className="h-20 w-20 rounded-md border object-cover" />
                                </a>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ---- 2. Position Details ---- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Position Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="date_of_joining">Date of Joining</Label>
                            <Input id="date_of_joining" type="date" value={form.date_of_joining} onChange={(e) => set('date_of_joining', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position_applied_for">Position Applied For</Label>
                            <SearchableSelect
                                label=""
                                placeholder="Select Position Applied For..."
                                options={designations.map((d) => ({ value: String(d.id), label: d.name }))}
                                value={form.position_applied_for}
                                onChange={(v) => set('position_applied_for', v)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <SearchableSelect
                                label=""
                                placeholder="Select Department..."
                                options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
                                value={form.department_id}
                                onChange={(v) => set('department_id', v)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Designation Level</Label>
                            <SearchableSelect
                                label=""
                                placeholder="Select Designation Level..."
                                options={designations.map((d) => ({ value: String(d.id), label: d.name }))}
                                value={form.designation_id}
                                onChange={(v) => set('designation_id', v)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select value={form.employment_type || undefined} onValueChange={(v) => set('employment_type', v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select Employment Type..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full-time</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="contractual">Contractual</SelectItem>
                                    <SelectItem value="internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="monthly_salary">Monthly Salary / Remuneration</Label>
                            <Input id="monthly_salary" type="number" step="0.01" min={0} value={form.monthly_salary} onChange={(e) => set('monthly_salary', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="functional_superior_name">Functional Superior Name</Label>
                            <Input id="functional_superior_name" value={form.functional_superior_name} onChange={(e) => set('functional_superior_name', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ---- 3. Educational Qualifications ---- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Educational Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="highest_degree">Highest Degree Earned</Label>
                            <Input id="highest_degree" value={form.highest_degree} onChange={(e) => set('highest_degree', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution / College / University Name</Label>
                            <Input id="institution" value={form.institution} onChange={(e) => set('institution', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passing_year">Passing Year</Label>
                            <Input id="passing_year" value={form.passing_year} onChange={(e) => set('passing_year', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cgpa">CGPA / GPA / Grade</Label>
                            <Input id="cgpa" value={form.cgpa} onChange={(e) => set('cgpa', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ---- 4. Certificate Attachments ---- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Certificate Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {FILE_KEYS.map((key, idx) => {
                            const existingPath = existing?.[key] ? String(existing[key]) : null;
                            return (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={key}>Certificate {String(idx + 1).padStart(2, '0')}</Label>
                                    <Input id={key} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(key, e.target.files?.[0] || null)} />
                                    {existingPath && (
                                        <a href={fileUrl(existingPath) ?? '#'} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                                            View current file
                                        </a>
                                    )}
                                    {files[key] && <p className="text-xs text-muted-foreground">{files[key]?.name}</p>}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                <Button variant="outline" type="button" onClick={() => router.get(employees.index().url)}>Cancel</Button>
            </div>
        </form>
    );
}
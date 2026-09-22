import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Eye, IdCard, Briefcase, GraduationCap, Paperclip } from 'lucide-react';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DepartmentRef {
    id: number;
    name: string;
}

interface EmployeeDetail {
    id: number;
    employee_id: string;
    full_name: string;
    father_name: string | null;
    mother_name: string | null;
    email: string | null;
    mobile: string | null;
    emergency_mobile: string | null;
    dob: string | null;
    present_address: string | null;
    permanent_address: string | null;
    marital_status: string | null;
    passport_no: string | null;
    blood_group: string | null;
    gender: string | null;
    age: number | null;
    religion: string | null;
    national_id: string | null;
    nationality: string | null;
    status: string;
    photo: string | null;
    date_of_joining: string | null;
    position_applied_for: string | null;
    designation_level: string | null;
    employment_type: string | null;
    monthly_salary: string | number | null;
    functional_superior_name: string | null;
    highest_degree: string | null;
    institution: string | null;
    passing_year: string | null;
    cgpa: string | null;
    certificate_1: string | null;
    certificate_2: string | null;
    certificate_3: string | null;
    certificate_4: string | null;
    certificate_5: string | null;
    certificate_6: string | null;
    department: DepartmentRef | null;
    designation: DepartmentRef | null;
}

function fmtDate(value: string | null): string {
    if (!value) return '-';
    return value.slice(0, 10);
}

function humanize(value: string | null | undefined): string {
    if (!value) return '-';
    return String(value).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Show() {
    const { employee } = usePage<{ employee: EmployeeDetail }>().props;
    const certs = ['certificate_1', 'certificate_2', 'certificate_3', 'certificate_4', 'certificate_5', 'certificate_6'] as const;

    const personal: [string, string][] = [
        ['Employee ID', employee.employee_id],
        ['Full Name', employee.full_name],
        ["Father's Name", employee.father_name ?? '-'],
        ["Mother's Name", employee.mother_name ?? '-'],
        ['Email', employee.email ?? '-'],
        ['Mobile', employee.mobile ?? '-'],
        ['Emergency Mobile', employee.emergency_mobile ?? '-'],
        ['Date of Birth', fmtDate(employee.dob)],
        ['Marital Status', humanize(employee.marital_status)],
        ['Passport No', employee.passport_no ?? '-'],
        ['Blood Group', employee.blood_group ?? '-'],
        ['Gender', humanize(employee.gender)],
        ['Age', employee.age != null ? String(employee.age) : '-'],
        ['Religion', humanize(employee.religion)],
        ['National ID', employee.national_id ?? '-'],
        ['Nationality', employee.nationality ?? '-'],
        ['Present Address', employee.present_address ?? '-'],
        ['Permanent Address', employee.permanent_address ?? '-'],
    ];

    const position: [string, string][] = [
        ['Date of Joining', fmtDate(employee.date_of_joining)],
        ['Position Applied For', employee.position_applied_for ?? '-'],
        ['Department', employee.department?.name ?? '-'],
        ['Designation Level', employee.designation_level ?? employee.designation?.name ?? '-'],
        ['Employment Type', humanize(employee.employment_type)],
        ['Monthly Salary', employee.monthly_salary != null ? `৳ ${Number(employee.monthly_salary).toLocaleString()}` : '-'],
        ['Functional Superior', employee.functional_superior_name ?? '-'],
    ];

    const education: [string, string][] = [
        ['Highest Degree', employee.highest_degree ?? '-'],
        ['Institution', employee.institution ?? '-'],
        ['Passing Year', employee.passing_year ?? '-'],
        ['CGPA / GPA', employee.cgpa ?? '-'],
    ];

    return (
        <>
            <Head title={employee.full_name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={employees.index().url}>
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Employee Profile</h1>
                    </div>
                    <Link href={employees.edit(employee.id).url}>
                        <Button><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
                        {employee.photo ? (
                            <img src={`/files/${employee.photo}`} alt={employee.full_name} className="h-24 w-24 rounded-full border object-cover" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-muted" />
                        )}
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-xl font-semibold">{employee.full_name}</h2>
                            <p className="text-sm text-muted-foreground">{employee.department?.name} · {employee.designation?.name || employee.designation_level}</p>
                            <p className="text-sm text-muted-foreground">{employee.email || employee.mobile}</p>
                            <div className="mt-2">
                                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>{employee.status}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><IdCard className="h-4 w-4" /> Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-3">
                            {personal.map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                                    <dd className="text-sm">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Position Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-3">
                            {position.map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                                    <dd className="text-sm">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Educational Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-3">
                            {education.map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                                    <dd className="text-sm">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Certificate Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {certs.map((key, idx) => {
                                const path = employee[key];
                                return (
                                    <div key={key} className="flex flex-col items-center gap-2 rounded-md border p-3">
                                        <span className="text-xs font-medium text-muted-foreground">Certificate {idx + 1}</span>
                                        {path ? (
                                            <a href={`/files/${path}`} target="_blank" rel="noreferrer" title="Preview certificate">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-1 h-4 w-4" /> Preview
                                                </Button>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Not uploaded</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'List of Employee', href: employees.index().url },
    ],
};
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import EmployeeForm from './form';

interface Option {
    id: number;
    name: string;
}

export default function Edit() {
    const { employee, departments, designations, countries } = usePage<{
        employee: Record<string, unknown>;
        departments: Option[];
        designations: Option[];
        countries: string[];
    }>().props;

    return (
        <>
            <Head title="Edit Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={employees.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Employee — {String(employee.full_name)}</h1>
                </div>

                <EmployeeForm existing={employee} departments={departments} designations={designations} countries={countries} />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
    ],
};
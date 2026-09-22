import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import EmployeeForm from './form';

interface Option {
    id: number;
    name: string;
}

export default function Create() {
    const { departments, designations, countries } = usePage<{
        departments: Option[];
        designations: Option[];
        countries: string[];
    }>().props;

    return (
        <>
            <Head title="Add Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={employees.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Employee Personal Info — New Employee</h1>
                </div>

                <EmployeeForm existing={null} departments={departments} designations={designations} countries={countries} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
        { title: 'Create', href: employees.create().url },
    ],
};
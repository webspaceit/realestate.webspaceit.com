import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import hr from '@/routes/hr';
import employees from '@/routes/employees';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import HrForm from './form';
import type { HrModule } from './index';

interface PageProps {
    module: HrModule;
    employeesMap: Record<string, string>;
    departmentsMap: Record<string, string>;
    designationsMap: Record<string, string>;
}

export default function Create() {
    const { module, employeesMap, departmentsMap, designationsMap } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Add ${module.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={hr.index(module.key).url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Add {module.title}</h1>
                </div>

                <HrForm module={module} existing={null} employeesMap={employeesMap} departmentsMap={departmentsMap} designationsMap={designationsMap} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'List of Employee', href: employees.index().url },
    ],
};
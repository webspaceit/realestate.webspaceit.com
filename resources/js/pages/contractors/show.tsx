import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import contractors from '@/routes/contractors';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DocumentViewer from '@/components/document-viewer';

interface Contractor {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    specialization: string;
    license_number: string;
    status: string;
    nid: string | null;
    bio_data: string | null;
    deed_of_agreement: string | null;
    passport_photo: string | null;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    pending: 'outline',
    completed: 'secondary',
    terminated: 'destructive',
};

export default function Show() {
    const { contractor } = usePage<{ contractor: Contractor }>().props;

    function handleDelete() {
        if (!confirm(`Delete contractor "${contractor.company_name}"?`)) return;
        router.delete(contractors.destroy(contractor.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Contractor deleted'),
        });
    }

    return (
        <>
            <Head title={contractor.company_name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={contractors.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{contractor.company_name}</h1>
                    <div className="ml-auto flex gap-2">
                        <Link href={contractors.edit(contractor.id).url}>
                            <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Company Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Company Name</span>
                                <p className="font-medium">{contractor.company_name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Contact Person</span>
                                <p className="font-medium">{contractor.contact_person}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Email</span>
                                <p className="font-medium">{contractor.email || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Phone</span>
                                <p className="font-medium">{contractor.phone || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Present Address</span>
                                <p className="font-medium">{contractor.address || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Specialization</span>
                                <p className="font-medium">{contractor.specialization}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">License Number</span>
                                <p className="font-medium">{contractor.license_number || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Work Status</span>
                                <div className="mt-1">
                                    <Badge variant={statusVariant[contractor.status] || 'outline'}>{contractor.status}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="text-sm text-muted-foreground">NID</span>
                                <p className="font-medium">
                                    <DocumentViewer filePath={contractor.nid} label="View NID" />
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Bio-data</span>
                                <p className="font-medium">
                                    <DocumentViewer filePath={contractor.bio_data} label="View Bio-data" />
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Deed of Agreement</span>
                                <p className="font-medium">
                                    <DocumentViewer filePath={contractor.deed_of_agreement} label="View Deed of Agreement" />
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Passport Size Photo</span>
                                <p className="font-medium">
                                    <DocumentViewer filePath={contractor.passport_photo} label="View Passport Photo" />
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = (props: { contractor: Contractor }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Contractors', href: contractors.index().url },
        { title: props.contractor.company_name, href: contractors.show(props.contractor.id).url },
    ],
});

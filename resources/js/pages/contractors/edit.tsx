import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import contractors from '@/routes/contractors';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function Edit() {
    const { contractor, specializations } = usePage<{ contractor: Contractor; specializations: string[] }>().props;

    const [form, setForm] = useState({
        company_name: contractor.company_name,
        contact_person: contractor.contact_person,
        email: contractor.email || '',
        phone: contractor.phone || '',
        address: contractor.address || '',
        specialization: contractor.specialization || '',
        license_number: contractor.license_number || '',
        status: contractor.status,
    });
    const [files, setFiles] = useState<Record<string, File | null>>({
        nid: null,
        bio_data: null,
        deed_of_agreement: null,
        passport_photo: null,
    });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(contractors.update(contractor.id).url, { ...form, ...files }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Contractor updated');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    }

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function setFile(field: string, file: File | null) {
        setFiles((prev) => ({ ...prev, [field]: file }));
    }

    return (
        <>
            <Head title="Edit Contractor" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={contractors.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Contractor</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Contractor Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Company Name</Label>
                                    <Input id="company_name" value={form.company_name} onChange={(e) => set('company_name', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">Contact Person</Label>
                                    <Input id="contact_person" value={form.contact_person} onChange={(e) => set('contact_person', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                                </div>
                                <SearchableSelect
                                    label="Specialization"
                                    placeholder="Select specialization..."
                                    options={specializations.map((s) => ({ value: s, label: s }))}
                                    value={form.specialization}
                                    onChange={(v) => set('specialization', v)}
                                />
                                <div className="space-y-2">
                                    <Label htmlFor="license_number">License Number</Label>
                                    <Input id="license_number" value={form.license_number} onChange={(e) => set('license_number', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Work Status</Label>
                                    <Select value={form.status} onValueChange={(v) => set('status', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Work Status..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Present Address</Label>
                                <textarea
                                    id="address"
                                    value={form.address}
                                    onChange={(e) => set('address', e.target.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                />
                            </div>

                            <CardTitle>Documents</CardTitle>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nid">NID</Label>
                                    {contractor.nid && <p className="text-xs"><DocumentViewer filePath={contractor.nid} label="Open current file" /></p>}
                                    <Input id="nid" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('nid', e.target.files?.[0] || null)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio_data">Bio-data</Label>
                                    {contractor.bio_data && <p className="text-xs"><DocumentViewer filePath={contractor.bio_data} label="Open current file" /></p>}
                                    <Input id="bio_data" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('bio_data', e.target.files?.[0] || null)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deed_of_agreement">Deed of Agreement</Label>
                                    {contractor.deed_of_agreement && <p className="text-xs"><DocumentViewer filePath={contractor.deed_of_agreement} label="Open current file" /></p>}
                                    <Input id="deed_of_agreement" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('deed_of_agreement', e.target.files?.[0] || null)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passport_photo">Passport Size Photo</Label>
                                    {contractor.passport_photo && <p className="text-xs"><DocumentViewer filePath={contractor.passport_photo} label="Open current file" /></p>}
                                    <Input id="passport_photo" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile('passport_photo', e.target.files?.[0] || null)} />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update'}</Button>
                                <Link href={contractors.index().url}>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Edit.layout = (props: { contractor: Contractor }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Contractors', href: contractors.index().url },
        { title: 'Edit', href: contractors.edit(props.contractor.id).url },
    ],
});

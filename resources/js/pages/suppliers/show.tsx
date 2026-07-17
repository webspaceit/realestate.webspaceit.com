import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Truck } from 'lucide-react';
import { toast } from 'sonner';
import suppliers from '@/routes/suppliers';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
}

interface Purchase {
    id: number;
    material: { id: number; name: string };
    quantity: number;
    unit_price: number;
    total_price: number;
    purchased_at: string;
}

export default function Show() {
    const { supplier, purchases } = usePage<{ supplier: Supplier; purchases: Purchase[] }>().props;

    function handleDelete() {
        if (!confirm(`Delete supplier "${supplier.company_name}"?`)) return;
        router.delete(suppliers.destroy(supplier.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Supplier deleted'),
        });
    }

    return (
        <>
            <Head title={supplier.company_name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={suppliers.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{supplier.company_name}</h1>
                    <div className="ml-auto flex gap-2">
                        <Link href={suppliers.edit(supplier.id).url}>
                            <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Supplier Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Company Name</span>
                                <p className="font-medium">{supplier.company_name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Contact Person</span>
                                <p className="font-medium">{supplier.contact_person}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Email</span>
                                <p className="font-medium">{supplier.email || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Phone</span>
                                <p className="font-medium">{supplier.phone || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Address</span>
                                <p className="font-medium">{supplier.address || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.material.name}</TableCell>
                                        <TableCell>{p.quantity}</TableCell>
                                        <TableCell>৳{Number(p.unit_price).toLocaleString()}</TableCell>
                                        <TableCell>৳{Number(p.total_price).toLocaleString()}</TableCell>
                                        <TableCell>{p.purchased_at}</TableCell>
                                    </TableRow>
                                ))}
                                {purchases.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            No purchases found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = (props: { supplier: Supplier }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Suppliers', href: suppliers.index().url },
        { title: props.supplier.company_name, href: suppliers.show(props.supplier.id).url },
    ],
});

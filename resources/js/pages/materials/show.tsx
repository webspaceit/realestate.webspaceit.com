import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Package } from 'lucide-react';
import { toast } from 'sonner';
import materials from '@/routes/materials';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

interface Material {
    id: number;
    name: string;
    sku: string;
    description: string;
    unit: string;
    unit_price: number;
    category: string;
}

interface Inventory {
    id: number;
    quantity: number;
    location: string;
}

interface Purchase {
    id: number;
    supplier: { id: number; company_name: string };
    quantity: number;
    unit_price: number;
    total_price: number;
    purchased_at: string;
}

export default function Show() {
    const { material, inventory, purchases } = usePage<{ material: Material; inventory: Inventory | null; purchases: Purchase[] }>().props;

    function handleDelete() {
        if (!confirm(`Delete material "${material.name}"?`)) return;
        router.delete(materials.destroy(material.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Material deleted'),
        });
    }

    return (
        <>
            <Head title={material.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={materials.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{material.name}</h1>
                    <div className="ml-auto flex gap-2">
                        <Link href={materials.edit(material.id).url}>
                            <Button variant="outline"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Material Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Name</span>
                                <p className="font-medium">{material.name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">SKU</span>
                                <p className="font-medium">{material.sku}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Category</span>
                                <p className="font-medium">{material.category}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Unit</span>
                                <p className="font-medium">{material.unit || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Unit Price</span>
                                <p className="text-lg font-bold">৳{Number(material.unit_price).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Description</span>
                                <p className="font-medium">{material.description || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {inventory ? (
                                <>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Quantity in Stock</span>
                                        <p className="text-lg font-bold">{inventory.quantity} {material.unit}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Location</span>
                                        <p className="font-medium">{inventory.location || '-'}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">No inventory records found.</p>
                            )}
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
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.supplier.company_name}</TableCell>
                                        <TableCell>{p.quantity}</TableCell>
                                        <TableCell>{Number(p.unit_price).toLocaleString()}</TableCell>
                                        <TableCell>{Number(p.total_price).toLocaleString()}</TableCell>
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

Show.layout = (props: { material: Material }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Materials', href: materials.index().url },
        { title: props.material.name, href: materials.show(props.material.id).url },
    ],
});

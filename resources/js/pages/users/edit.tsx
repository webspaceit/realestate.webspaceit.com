import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import users from '@/routes/users';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Edit() {
    const { user } = usePage<{ user: User }>().props;
    const [form, setForm] = useState({ name: user.name, email: user.email, password: '', password_confirmation: '', role: user.role });
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put(users.update(user.id).url, form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('User updated');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    }

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={users.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit User</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password (leave empty to keep current)</Label>
                                    <Input id="password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input id="password_confirmation" type="password" value={form.password_confirmation} onChange={(e) => set('password_confirmation', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={form.role} onValueChange={(v) => set('role', v)}>
                                        <SelectTrigger id="role"><SelectValue placeholder="Select Role..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="client">Client</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                                <Link href={users.index().url}>
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

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Users', href: users.index().url },
        { title: 'Edit', href: '' },
    ],
};

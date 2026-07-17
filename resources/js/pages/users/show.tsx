import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, Calendar, Shield, User as UserIcon } from 'lucide-react';
import users from '@/routes/users';
import { dashboard } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

const roleVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    admin: 'default',
    manager: 'secondary',
    staff: 'outline',
    client: 'destructive',
};

export default function Show() {
    const { user } = usePage<{ user: User }>().props;

    return (
        <>
            <Head title={user.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={users.index().url}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <Badge variant={roleVariant[user.role] || 'outline'}>{user.role}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    <Link href={users.edit(user.id).url}>
                        <Button>Edit User</Button>
                    </Link>
                    <Link href={users.index().url}>
                        <Button variant="outline">Back to Users</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Users', href: users.index().url },
        { title: 'Show', href: '' },
    ],
};

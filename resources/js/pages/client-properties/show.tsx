import { Head, Link, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { dashboard } from '@/routes'
import { index, show } from '@/routes/client-properties'

interface Building {
    id: number
    name: string
}

interface Unit {
    id: number
    unit_number: string
    building: Building
}

interface Client {
    id: number
    contact_person: string
    company_name?: string
    email?: string
    phone?: string
}

interface ClientProperty {
    id: number
    client: Client
    unit: Unit
    ownership_start: string
    ownership_end: string | null
}

interface PageProps {
    clientProperty: ClientProperty
}

export default function Show() {
    const { clientProperty: cp } = usePage<PageProps>().props

    return (
        <>
            <Head title="Client Property Detail" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={index()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Client Properties
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Unit Information</CardTitle>
                                <CardDescription>Property details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Unit Number</p>
                            <p className="font-medium">{cp.unit.unit_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Building</p>
                            <p className="font-medium">{cp.unit.building.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ownership Start</p>
                            <p className="font-medium">{new Date(cp.ownership_start).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ownership End</p>
                            <p className="font-medium">
                                {cp.ownership_end ? new Date(cp.ownership_end).toLocaleDateString() : (
                                    <Badge variant="secondary">Current</Badge>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Client Information</CardTitle>
                                <CardDescription>Assigned client</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Contact Person</p>
                            <p className="font-medium">{cp.client.contact_person}</p>
                        </div>
                        {cp.client.company_name && (
                            <div>
                                <p className="text-sm text-muted-foreground">Company</p>
                                <p className="font-medium">{cp.client.company_name}</p>
                            </div>
                        )}
                        {cp.client.email && (
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{cp.client.email}</p>
                            </div>
                        )}
                        {cp.client.phone && (
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{cp.client.phone}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Show.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Client Properties', href: index() },
        { title: 'Detail', href: show({ client_property: props.clientProperty.id }) },
    ],
})

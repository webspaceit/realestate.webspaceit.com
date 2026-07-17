import { Head, Link, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, FileDown, UserCircle } from 'lucide-react'
import { pdf } from '@/routes/flat-owners'

interface User {
    id: number
    name: string
    email: string
}

interface Building {
    id: number
    name: string
}

interface Unit {
    id: number
    unit_number: string
    building: Building
}

interface Project {
    id: number
    name: string
}

interface ClientProperty {
    id: number
    unit: Unit
    project: Project | null
    ownership_start: string
    ownership_end: string | null
}

interface Nominee {
    id: number
    name: string
    relationship: string
    date_of_birth: string | null
    percentage: number | null
}

interface Client {
    id: number
    user?: User
    owner_id: string
    company_name: string
    contact_person: string
    email: string
    phone: string
    phone_mobile: string
    phone_whatsapp: string
    date_of_birth: string
    nid_no: string
    tin_no: string
    passport_no: string
    driving_licence: string
    profession: string
    nationality: string
    father_name: string
    mother_name: string
    spouse_name: string
    spouse_nid_no: string
    present_address: string
    permanent_address: string
    professional_address: string
    photo: string | null
    photo_url: string | null
    nominees: Nominee[]
    created_at: string
    properties: ClientProperty[]
}

interface PageProps {
    client: Client
}

export default function Show() {
    const { client } = usePage<PageProps>().props

    return (
        <>
            <Head title={client.contact_person || client.company_name || 'Flat Owner'} />

            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/flat-owners">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Flat Owners Detail
                    </Link>
                </Button>
                <Button variant="outline" asChild disabled={!client.id}>
                    <a href={client.id ? pdf(client.id).url : '#'} target="_blank" rel="noreferrer">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                    </a>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="flex flex-col items-center gap-3">
                            {client.photo_url ? (
                                <img src={client.photo_url} alt={client.contact_person || ''} className="h-20 w-20 rounded-full object-cover border" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                    <UserCircle className="h-10 w-10 text-primary" />
                                </div>
                            )}
                            <div className="text-center">
                                <CardTitle>{client.contact_person || client.company_name}</CardTitle>
                                <CardDescription>{client.designation}{client.designation && client.company_name ? ' — ' : ''}{client.company_name}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground">ID / Number</p>
                            <p className="text-sm font-mono font-medium">{client.owner_id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{client.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{client.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Mobile</p>
                            <p className="text-sm font-medium">{client.phone_mobile || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Whatsapp</p>
                            <p className="text-sm font-medium">{client.phone_whatsapp || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Profession</p>
                            <p className="text-sm font-medium">{client.profession || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Nationality</p>
                            <p className="text-sm font-medium">{client.nationality || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Date of Birth</p>
                            <p className="text-sm font-medium">{client.date_of_birth || '-'}</p>
                        </div>
                        {client.user && (
                            <div>
                                <p className="text-xs text-muted-foreground">Linked User</p>
                                <p className="text-sm font-medium">{client.user.name} ({client.user.email})</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground">Flat Owner Since</p>
                            <p className="text-sm font-medium">{new Date(client.created_at).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identification</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">NID No.</p>
                                <p className="font-medium">{client.nid_no || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">TIN No.</p>
                                <p className="font-medium">{client.tin_no || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Passport No.</p>
                                <p className="font-medium">{client.passport_no || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Driving Licence</p>
                                <p className="font-medium">{client.driving_licence || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Family Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">Father's Name</p>
                                <p className="font-medium">{client.father_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Mother's Name</p>
                                <p className="font-medium">{client.mother_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Spouse Name</p>
                                <p className="font-medium">{client.spouse_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Spouse NID No.</p>
                                <p className="font-medium">{client.spouse_nid_no || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Addresses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="font-medium">{client.address || '-'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Present Address</p>
                                    <p className="font-medium">{client.present_address || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Permanent Address</p>
                                    <p className="font-medium">{client.permanent_address || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Professional Address</p>
                                <p className="font-medium">{client.professional_address || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nominees</CardTitle>
                            <CardDescription>Nominee details for this flat owner</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead>Percentage</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.nominees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                                No nominees added.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        client.nominees.map((nominee) => (
                                            <TableRow key={nominee.id}>
                                                <TableCell className="font-medium">{nominee.name}</TableCell>
                                                <TableCell>{nominee.relationship}</TableCell>
                                                <TableCell>{nominee.date_of_birth ? new Date(nominee.date_of_birth).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell>{nominee.percentage != null ? `${nominee.percentage}%` : '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Properties</CardTitle>
                            <CardDescription>Units owned by this flat owner</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Building</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.properties.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                                No properties assigned.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        client.properties.map((cp) => (
                                            <TableRow key={cp.id}>
                                                <TableCell>{cp.project?.name || '-'}</TableCell>
                                                <TableCell className="font-medium">{cp.unit.unit_number}</TableCell>
                                                <TableCell>{cp.unit.building.name}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

Show.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flat Owners Detail', href: '/flat-owners' },
        { title: props.client.contact_person || props.client.company_name, href: props.client.id ? '/flat-owners/' + props.client.id : '/flat-owners' },
    ],
})

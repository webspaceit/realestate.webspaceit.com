import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboard } from '@/routes'
import meetings from '@/routes/meetings'
import MeetingForm from '@/pages/meetings/form'

interface Party {
    id: number
    contact_person: string
    company_name: string | null
}

interface User {
    id: number
    name: string
}

interface PageProps {
    leads: Party[]
    clients: Party[]
    users: User[]
    statuses: string[]
}

export default function Create() {
    const { leads, clients, users, statuses } = usePage<PageProps>().props

    const params = new URLSearchParams(window.location.search)
    const initialLeadId = params.get('lead_id') || undefined
    const initialClientId = params.get('client_id') || undefined

    return (
        <>
            <Head title="Schedule Meeting" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={meetings.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Meetings
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Schedule Meeting</h1>
            </div>

            <MeetingForm
                leads={leads}
                clients={clients}
                users={users}
                statuses={statuses}
                initialLeadId={initialLeadId}
                initialClientId={initialClientId}
            />
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Meetings & Site Visits', href: '/meetings' },
        { title: 'Schedule Meeting', href: '/meetings/create' },
    ],
}
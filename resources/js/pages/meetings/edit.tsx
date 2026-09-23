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

interface Meeting {
    id: number
    lead_id: number | null
    client_id: number | null
    title: string
    location: string | null
    scheduled_at: string
    status: string
    notes: string | null
    outcome: string | null
    organizer_id: number | null
}

interface PageProps {
    meeting: Meeting
    leads: Party[]
    clients: Party[]
    users: User[]
    statuses: string[]
}

export default function Edit() {
    const { meeting, leads, clients, users, statuses } = usePage<PageProps>().props

    return (
        <>
            <Head title="Edit Meeting" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={meetings.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Meetings
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Edit Meeting</h1>
            </div>

            <MeetingForm existing={meeting} leads={leads} clients={clients} users={users} statuses={statuses} />
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Meetings & Site Visits', href: '/meetings' },
        { title: 'Edit Meeting', href: '/meetings/edit' },
    ],
}
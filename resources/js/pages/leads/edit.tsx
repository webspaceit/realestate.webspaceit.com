import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboard } from '@/routes'
import leads from '@/routes/leads'
import LeadForm, { type Stage } from '@/pages/leads/form'

interface User {
    id: number
    name: string
}

interface Lead {
    id: number
    contact_person: string
    company_name: string | null
    email: string | null
    phone: string | null
    source: string | null
    stage: string
    probability: number
    value: string
    assigned_to_id: number | null
    follow_up_date: string | null
    notes: string | null
}

interface PageProps {
    lead: Lead
    users: User[]
    stages: Stage[]
    sources: string[]
}

export default function Edit() {
    const { lead, users, stages, sources } = usePage<PageProps>().props

    return (
        <>
            <Head title="Edit Lead" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={leads.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leads
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Edit Lead</h1>
            </div>

            <LeadForm existing={lead} users={users} stages={stages} sources={sources} />
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Leads & Opportunities', href: '/leads' },
        { title: 'Edit Lead', href: '/leads/edit' },
    ],
}
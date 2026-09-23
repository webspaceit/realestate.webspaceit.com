import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboard } from '@/routes'
import interactions from '@/routes/interactions'
import InteractionForm from '@/pages/interactions/form'

interface Party {
    id: number
    contact_person: string
    company_name: string | null
}

interface User {
    id: number
    name: string
}

interface Interaction {
    id: number
    lead_id: number | null
    client_id: number | null
    type: string
    subject: string
    notes: string | null
    interaction_date: string
    recorded_by_id: number | null
}

interface PageProps {
    interaction: Interaction
    leads: Party[]
    clients: Party[]
    users: User[]
    types: string[]
}

export default function Edit() {
    const { interaction, leads, clients, users, types } = usePage<PageProps>().props

    return (
        <>
            <Head title="Edit Interaction" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={interactions.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Interactions
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Edit Interaction</h1>
            </div>

            <InteractionForm existing={interaction} leads={leads} clients={clients} users={users} types={types} />
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Interactions', href: '/interactions' },
        { title: 'Edit Interaction', href: '/interactions/edit' },
    ],
}
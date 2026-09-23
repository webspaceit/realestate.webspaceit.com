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

interface PageProps {
    leads: Party[]
    clients: Party[]
    users: User[]
    types: string[]
}

export default function Create() {
    const { leads, clients, users, types } = usePage<PageProps>().props

    const params = new URLSearchParams(window.location.search)
    const initialLeadId = params.get('lead_id') || undefined
    const initialClientId = params.get('client_id') || undefined

    return (
        <>
            <Head title="Log Interaction" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={interactions.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Interactions
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Log Interaction</h1>
            </div>

            <InteractionForm
                leads={leads}
                clients={clients}
                users={users}
                types={types}
                initialLeadId={initialLeadId}
                initialClientId={initialClientId}
            />
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Interactions', href: '/interactions' },
        { title: 'Log Interaction', href: '/interactions/create' },
    ],
}
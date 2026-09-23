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

interface PageProps {
    users: User[]
    stages: Stage[]
    sources: string[]
    defaultStage: string
}

export default function Create() {
    const { users, stages, sources, defaultStage } = usePage<PageProps>().props

    return (
        <>
            <Head title="Create Lead" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href={leads.index().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leads
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Create Lead</h1>
            </div>

            <LeadForm users={users} stages={stages} sources={sources} defaultStage={defaultStage} />
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Leads & Opportunities', href: '/leads' },
        { title: 'Create Lead', href: '/leads/create' },
    ],
}
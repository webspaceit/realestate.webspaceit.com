import { router } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import interactions from '@/routes/interactions'

interface Party {
    id: number
    contact_person: string
    company_name: string | null
}

interface User {
    id: number
    name: string
}

interface InteractionFormProps {
    existing?: Record<string, unknown> | null
    leads: Party[]
    clients: Party[]
    users: User[]
    types: string[]
    initialLeadId?: string
    initialClientId?: string
}

export interface InteractionFields {
    lead_id: string
    client_id: string
    type: string
    subject: string
    notes: string
    interaction_date: string
    recorded_by_id: string
}

export default function InteractionForm({ existing, leads, clients, users, types, initialLeadId, initialClientId }: InteractionFormProps) {
    const today = new Date().toISOString().slice(0, 10)
    const [form, setForm] = useState<InteractionFields>({
        lead_id: String(existing?.lead_id ?? initialLeadId ?? ''),
        client_id: String(existing?.client_id ?? initialClientId ?? ''),
        type: (existing?.type as string) || '',
        subject: (existing?.subject as string) || '',
        notes: (existing?.notes as string) || '',
        interaction_date: (existing?.interaction_date as string) || today,
        recorded_by_id: existing?.recorded_by_id != null ? String(existing.recorded_by_id) : '',
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const payload = {
            ...form,
            lead_id: form.lead_id === '' ? null : form.lead_id,
            client_id: form.client_id === '' ? null : form.client_id,
            recorded_by_id: form.recorded_by_id === '' ? null : form.recorded_by_id,
        }
        if (existing?.id) {
            router.put(interactions.update(existing.id).url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Interaction updated successfully'),
            })
        } else {
            router.post(interactions.store().url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Interaction logged successfully'),
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Interaction Details</CardTitle>
                    <CardDescription>Calls, meetings, site visits, emails, WhatsApp — logged against a lead or client</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="lead_id">Related Lead</Label>
                        <Select value={form.lead_id || undefined} onValueChange={(v) => setForm({ ...form, lead_id: v, client_id: '' })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Lead..." /></SelectTrigger>
                            <SelectContent>
                                {leads.map((l) => (
                                    <SelectItem key={l.id} value={String(l.id)}>{l.company_name || l.contact_person}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="client_id">Related Client</Label>
                        <Select value={form.client_id || undefined} onValueChange={(v) => setForm({ ...form, client_id: v, lead_id: '' })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Client..." /></SelectTrigger>
                            <SelectContent>
                                {clients.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.company_name || c.contact_person}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
                        <Select value={form.type || undefined} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Type..." /></SelectTrigger>
                            <SelectContent>
                                {types.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interaction_date">Date <span className="text-destructive">*</span></Label>
                        <Input id="interaction_date" type="date" value={form.interaction_date} onChange={(e) => setForm({ ...form, interaction_date: e.target.value })} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                        <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recorded_by_id">Recorded By</Label>
                        <Select value={form.recorded_by_id || undefined} onValueChange={(v) => setForm({ ...form, recorded_by_id: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select User..." /></SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Summary of the conversation, decisions, next steps..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">{existing?.id ? 'Update Interaction' : 'Log Interaction'}</Button>
            </div>
        </form>
    )
}
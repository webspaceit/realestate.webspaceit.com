import { router } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import meetings from '@/routes/meetings'

interface Party {
    id: number
    contact_person: string
    company_name: string | null
}

interface User {
    id: number
    name: string
}

interface MeetingFormProps {
    existing?: Record<string, unknown> | null
    leads: Party[]
    clients: Party[]
    users: User[]
    statuses: string[]
    initialLeadId?: string
    initialClientId?: string
}

export interface MeetingFields {
    lead_id: string
    client_id: string
    title: string
    location: string
    scheduled_at: string
    status: string
    notes: string
    outcome: string
    organizer_id: string
}

function toDatetimeLocal(value: unknown): string {
    if (!value) return ''
    const s = String(value)
    // Normalize "2026-09-23 14:30:00" -> "2026-09-23T14:30"
    return s.includes('T') ? s.slice(0, 16) : s.slice(0, 16).replace(' ', 'T')
}

export default function MeetingForm({ existing, leads, clients, users, statuses, initialLeadId, initialClientId }: MeetingFormProps) {
    const [form, setForm] = useState<MeetingFields>({
        lead_id: String(existing?.lead_id ?? initialLeadId ?? ''),
        client_id: String(existing?.client_id ?? initialClientId ?? ''),
        title: (existing?.title as string) || '',
        location: (existing?.location as string) || '',
        scheduled_at: toDatetimeLocal(existing?.scheduled_at),
        status: (existing?.status as string) || 'Scheduled',
        notes: (existing?.notes as string) || '',
        outcome: (existing?.outcome as string) || '',
        organizer_id: existing?.organizer_id != null ? String(existing.organizer_id) : '',
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const payload = {
            ...form,
            lead_id: form.lead_id === '' ? null : form.lead_id,
            client_id: form.client_id === '' ? null : form.client_id,
            organizer_id: form.organizer_id === '' ? null : form.organizer_id,
        }
        if (existing?.id) {
            router.put(meetings.update(existing.id).url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Meeting updated successfully'),
            })
        } else {
            router.post(meetings.store().url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Meeting scheduled successfully'),
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Meeting Details</CardTitle>
                    <CardDescription>Schedule client meetings, progress reviews, or site visits</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                        <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Office, site, video call..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scheduled_at">Scheduled At <span className="text-destructive">*</span></Label>
                        <Input id="scheduled_at" type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Status..." /></SelectTrigger>
                            <SelectContent>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lead_id">Related Lead</Label>
                        <Select value={form.lead_id} onValueChange={(v) => setForm({ ...form, lead_id: v, client_id: '' })}>
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
                        <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v, lead_id: '' })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Client..." /></SelectTrigger>
                            <SelectContent>
                                {clients.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.company_name || c.contact_person}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organizer_id">Organizer</Label>
                        <Select value={form.organizer_id} onValueChange={(v) => setForm({ ...form, organizer_id: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select User..." /></SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes / Agenda</Label>
                        <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="outcome">Outcome</Label>
                        <textarea
                            id="outcome"
                            rows={3}
                            value={form.outcome}
                            onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Decisions made, next steps, follow-up items..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">{existing?.id ? 'Update Meeting' : 'Schedule Meeting'}</Button>
            </div>
        </form>
    )
}
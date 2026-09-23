import { router } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import leads from '@/routes/leads'

interface User {
    id: number
    name: string
}

export interface Stage {
    key: string
    badge: string
    probability: number
}

export interface LeadFields {
    contact_person: string
    company_name: string
    email: string
    phone: string
    source: string
    stage: string
    probability: string
    value: string
    assigned_to_id: string
    follow_up_date: string
    notes: string
}

interface LeadFormProps {
    existing?: Record<string, unknown> | null
    users: User[]
    stages: Stage[]
    sources: string[]
    defaultStage?: string
}

export default function LeadForm({ existing, users, stages, sources, defaultStage = 'Inquiry' }: LeadFormProps) {
    const [form, setForm] = useState<LeadFields>({
        contact_person: (existing?.contact_person as string) || '',
        company_name: (existing?.company_name as string) || '',
        email: (existing?.email as string) || '',
        phone: (existing?.phone as string) || '',
        source: (existing?.source as string) || '',
        stage: (existing?.stage as string) || defaultStage,
        probability: String(existing?.probability ?? stages.find((s) => s.key === (existing?.stage || defaultStage))?.probability ?? 10),
        value: existing?.value != null ? String(existing.value) : '',
        assigned_to_id: existing?.assigned_to_id != null ? String(existing.assigned_to_id) : '',
        follow_up_date: (existing?.follow_up_date as string) || '',
        notes: (existing?.notes as string) || '',
    })

    function handleStageChange(stage: string) {
        setForm((f) => ({
            ...f,
            stage,
            probability: String(stages.find((s) => s.key === stage)?.probability ?? Number(f.probability)),
        }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const payload = {
            ...form,
            value: form.value === '' ? '0' : form.value,
            assigned_to_id: form.assigned_to_id === '' ? null : form.assigned_to_id,
        }
        if (existing?.id) {
            router.put(leads.update(existing.id).url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Lead updated successfully'),
            })
        } else {
            router.post(leads.store().url, payload, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Lead created successfully'),
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Primary contact details for this lead or opportunity</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contact_person">Contact Person <span className="text-destructive">*</span></Label>
                        <Input id="contact_person" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input id="company_name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Source..." /></SelectTrigger>
                            <SelectContent>
                                {sources.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assigned_to_id">Assigned To</Label>
                        <Select value={form.assigned_to_id} onValueChange={(v) => setForm({ ...form, assigned_to_id: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select User..." /></SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="follow_up_date">Follow-up Date</Label>
                        <Input id="follow_up_date" type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="value">Expected Value (৳)</Label>
                        <Input id="value" type="number" min={0} step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="0.00" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pipeline Stage</CardTitle>
                    <CardDescription>Move the deal through the pipeline; probability auto-updates per stage</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="stage">Stage <span className="text-destructive">*</span></Label>
                        <Select value={form.stage} onValueChange={handleStageChange}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select Stage..." /></SelectTrigger>
                            <SelectContent>
                                {stages.map((s) => (
                                    <SelectItem key={s.key} value={s.key}>{s.key}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="probability">Probability (%)</Label>
                        <Input id="probability" type="number" min={0} max={100} value={form.probability} onChange={(e) => setForm({ ...form, probability: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Requirements, budget, timeline, decision makers..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">{existing?.id ? 'Update Lead' : 'Create Lead'}</Button>
            </div>
        </form>
    )
}
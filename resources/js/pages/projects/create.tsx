import { useState, FormEvent } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { dashboard } from '@/routes'
import projects from '@/routes/projects'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SearchableSelect from '@/components/ui/searchable-select'
import { toast } from 'sonner'

interface Division {
    id: number
    name: string
}

interface District {
    id: number
    division_id: number
    name: string
}

interface Thana {
    id: number
    district_id: number
    name: string
}

interface Props {
    projectTypes: { id: number; name: string }[]
    divisions: Division[]
    districts: District[]
    thanas: Thana[]
}

export default function Create() {
    const { projectTypes, divisions, districts, thanas } = usePage<Props>().props
    const [form, setForm] = useState({ name: '', project_type_id: '', description: '', start_date: '', end_date: '', budget: '', land_size_katha: '', land_details: '', rajuk_file_submit_date: '', rajuk_permission_status: 'not_submitted', total_unit: '', total_flat: '', total_floor: '', total_parking: '', status: 'planning', division_id: '', district_id: '', thana_id: '', address: '' })
    const [submitting, setSubmitting] = useState(false)

    const filteredDistricts = form.division_id ? districts.filter(d => d.division_id === Number(form.division_id)) : []
    const filteredThanas = form.district_id ? thanas.filter(t => t.district_id === Number(form.district_id)) : []

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        router.post(projects.store.url(), {
            ...form,
            budget: Number(form.budget) || 0,
            land_size_katha: Number(form.land_size_katha) || 0,
            land_details: form.land_details || null,
            rajuk_file_submit_date: form.rajuk_file_submit_date || null,
            rajuk_permission_status: form.rajuk_permission_status || 'not_submitted',
            total_unit: form.total_unit ? Number(form.total_unit) : null,
            total_flat: form.total_flat ? Number(form.total_flat) : null,
            total_floor: form.total_floor ? Number(form.total_floor) : null,
            total_parking: form.total_parking ? Number(form.total_parking) : null,
            project_type_id: form.project_type_id ? Number(form.project_type_id) : null,
            division_id: form.division_id ? Number(form.division_id) : null,
            district_id: form.district_id ? Number(form.district_id) : null,
            thana_id: form.thana_id ? Number(form.thana_id) : null,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { toast.success('Project created'); setSubmitting(false) },
            onError: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Create Project" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={projects.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Create Project</h1>
                </div>

                <Card>
                    <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                            <div>
                                <SearchableSelect
                                    label="Project Type"
                                    placeholder="Select Project Type..."
                                    options={projectTypes.map(pt => ({ value: String(pt.id), label: pt.name }))}
                                    value={form.project_type_id}
                                    onChange={(v) => setForm({ ...form, project_type_id: v })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                                <SearchableSelect
                                    label="Status"
                                    placeholder="Select Status..."
                                    options={[
                                        { value: 'planning', label: 'Planning' },
                                        { value: 'in_progress', label: 'In Progress' },
                                        { value: 'completed', label: 'Completed' },
                                        { value: 'on_hold', label: 'On Hold' },
                                    ]}
                                    value={form.status}
                                    onChange={(v) => setForm({ ...form, status: v })}
                                />
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="budget">Budget</Label>
                                <Input id="budget" type="number" step="0.01" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                            </div>
                            <div className="col-span-3 grid grid-cols-5 gap-4">
                                <div>
                                    <Label htmlFor="land_size_katha">Land Size (In Katha)</Label>
                                    <Input id="land_size_katha" type="number" step="0.01" value={form.land_size_katha} onChange={e => setForm({ ...form, land_size_katha: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="total_unit">Total Unit</Label>
                                    <Input id="total_unit" type="number" value={form.total_unit} onChange={e => setForm({ ...form, total_unit: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="total_floor">Total Floor</Label>
                                    <Input id="total_floor" type="number" value={form.total_floor} onChange={e => setForm({ ...form, total_floor: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="total_flat">Total Flat</Label>
                                    <Input id="total_flat" type="number" value={form.total_flat} onChange={e => setForm({ ...form, total_flat: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="total_parking">Total Parking</Label>
                                    <Input id="total_parking" type="number" value={form.total_parking} onChange={e => setForm({ ...form, total_parking: e.target.value })} />
                                </div>
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor="land_details">Details of The Land (Optional)</Label>
                                <textarea id="land_details" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.land_details} onChange={e => setForm({ ...form, land_details: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="rajuk_file_submit_date">Rajuk File Submit Date</Label>
                                <Input id="rajuk_file_submit_date" type="date" value={form.rajuk_file_submit_date} onChange={e => setForm({ ...form, rajuk_file_submit_date: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <SearchableSelect
                                    label="Rajuk Permission Status"
                                    placeholder="Select Rajuk Permission Status..."
                                    options={[
                                        { value: 'not_submitted', label: 'Not Submitted' },
                                        { value: 'file_submitted', label: 'File Submitted' },
                                        { value: 'processing', label: 'Processing' },
                                        { value: 'on_hold', label: 'On Hold' },
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'rejected', label: 'Rejected' },
                                        { value: 'approved', label: 'Approved' },
                                    ]}
                                    value={form.rajuk_permission_status}
                                    onChange={(v) => setForm({ ...form, rajuk_permission_status: v })}
                                />
                            </div>
                            <div className="col-span-3 border-t pt-4 mt-2">
                                <h3 className="font-medium mb-3">Project Address</h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <SearchableSelect
                                        label="Division"
                                        placeholder="Select Division..."
                                        options={divisions.map(d => ({ value: String(d.id), label: d.name }))}
                                        value={form.division_id}
                                        onChange={(v) => setForm({ ...form, division_id: v, district_id: '', thana_id: '' })}
                                    />
                                    <SearchableSelect
                                        label="District"
                                        placeholder={form.division_id ? 'Select District...' : 'Select Division First...'}
                                        disabled={!form.division_id}
                                        options={filteredDistricts.map(d => ({ value: String(d.id), label: d.name }))}
                                        value={form.district_id}
                                        onChange={(v) => setForm({ ...form, district_id: v, thana_id: '' })}
                                    />
                                    <SearchableSelect
                                        label="Thana"
                                        placeholder={form.district_id ? 'Select Thana...' : 'Select District First...'}
                                        disabled={!form.district_id}
                                        options={filteredThanas.map(t => ({ value: String(t.id), label: t.name }))}
                                        value={form.thana_id}
                                        onChange={(v) => setForm({ ...form, thana_id: v })}
                                    />
                                </div>
                                <Label htmlFor="address">Address</Label>
                                <textarea id="address" className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 pt-4">
                                <Link href={projects.index.url()}><Button variant="outline" type="button">Cancel</Button></Link>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projects.index.url() },
        { title: 'Create', href: projects.create.url() },
    ],
}

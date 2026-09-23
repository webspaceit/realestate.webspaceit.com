import { Head, Link, router, usePage } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import SearchableSelect from '@/components/ui/searchable-select'
import { ArrowLeft, Upload, X, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { index, store } from '@/routes/documents'

interface Project {
    id: number
    name: string
}

interface Building {
    id: number
    name: string
    project_id: number
}

interface Category {
    id: number
    name: string
}

interface Subcategory {
    id: number
    name: string
    document_category_id: number
}

interface ExistingDoc {
    project_id: number
    building_id: number
    subcategory_id: number
}

interface PageProps {
    projects: Project[]
    buildings: Building[]
    categories: Category[]
    subcategories: Subcategory[]
    existingDocs: ExistingDoc[]
}

interface Entry {
    file: File
    subcategoryId: string
    category: string
    detectedType: string
}

export default function Create() {
    const { projects, buildings, categories, subcategories, existingDocs } = usePage<PageProps>().props
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [entries, setEntries] = useState<Entry[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [category, setCategory] = useState('')
    const [subcategoryId, setSubcategoryId] = useState('')
    const [addedSubcategoryIds, setAddedSubcategoryIds] = useState<Set<string>>(new Set())
    const [projectId, setProjectId] = useState('')
    const [buildingId, setBuildingId] = useState('')
    const [saving, setSaving] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const filteredBuildings = projectId ? buildings.filter((b) => b.project_id === Number(projectId)) : buildings

    const usedSubcategoryIds = new Set(
        existingDocs
            .filter((d) => String(d.project_id) === projectId && String(d.building_id) === buildingId)
            .map((d) => String(d.subcategory_id)),
    )

    const selectedCategory = categories.find((c) => c.name === category)
    const filteredSubcategories = selectedCategory
        ? subcategories.filter(
              (s) =>
                  s.document_category_id === selectedCategory.id &&
                  !addedSubcategoryIds.has(String(s.id)) &&
                  !usedSubcategoryIds.has(String(s.id)),
          )
        : []

    const detectedType = (() => {
        const ext = file?.name.split('.').pop()?.toLowerCase()
        if (!ext) return ''
        if (['pdf'].includes(ext)) return 'pdf'
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image'
        if (['xls', 'xlsx', 'csv'].includes(ext)) return 'spreadsheet'
        if (['doc', 'docx'].includes(ext)) return 'document'
        return 'other'
    })()

    function handleProjectChange(value: string) {
        setProjectId(value)
        if (value && buildingId && !buildings.find((b) => b.id === Number(buildingId) && b.project_id === Number(value))) {
            setBuildingId('')
        }
    }

    function handleCategoryChange(value: string) {
        setCategory(value)
        const cat = categories.find((c) => c.name === value)
        if (subcategoryId && cat && !subcategories.find((s) => s.id === Number(subcategoryId) && s.document_category_id === cat.id)) {
            setSubcategoryId('')
        }
    }

    function handleAdd() {
        if (!file || !subcategoryId) return
        setEntries((prev) => [...prev, { file, subcategoryId, category, detectedType }])
        setAddedSubcategoryIds((prev) => new Set(prev).add(subcategoryId))
        setSubcategoryId('')
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    function removeEntry(index: number) {
        const removed = entries[index]
        setEntries((prev) => prev.filter((_, i) => i !== index))
        setAddedSubcategoryIds((prev) => {
            const next = new Set(prev)
            next.delete(removed.subcategoryId)
            return next
        })
    }

    function viewFile() {
        if (!file) return
        setPreviewUrl(URL.createObjectURL(file))
    }

    function closePreview() {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
    }

    function clearFile() {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (entries.length === 0) return
        setSaving(true)
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i]
            const data = new FormData()
            const sub = subcategories.find((s) => s.id === Number(entry.subcategoryId))
            const baseName = entry.file.name.split('.').shift() || 'Untitled'
            data.append('name', sub ? `${baseName} - ${sub.name}` : baseName)
            data.append('file', entry.file)
            data.append('type', entry.detectedType)
            data.append('category', entry.category)
            data.append('subcategory_id', entry.subcategoryId)
            data.append('project_id', projectId || '')
            data.append('building_id', buildingId || '')
            await new Promise<void>((resolve, reject) => {
                router.post(store(), data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: () => reject(),
                    onFinish: () => {},
                })
            })
        }
        setEntries([])
        setAddedSubcategoryIds(new Set())
        setSaving(false)
        toast.success('All documents created successfully')
    }

    return (
        <>
            <Head title="Create Document" />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={index()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Documents
                    </Link>
                </Button>
            </div>

            <Card className="mx-auto max-w-6xl">
                <CardHeader>
                    <CardTitle>Create Document</CardTitle>
                    <CardDescription>Add a new document record</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <SearchableSelect
                                label="Project"
                                placeholder="Select Project..."
                                options={projects.map((p) => ({ value: String(p.id), label: p.name }))}
                                value={projectId}
                                onChange={handleProjectChange}
                            />
                            <SearchableSelect
                                label="Building"
                                placeholder="Select Building..."
                                disabled={!projectId}
                                options={filteredBuildings.map((b) => ({ value: String(b.id), label: b.name }))}
                                value={buildingId}
                                onChange={setBuildingId}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <SearchableSelect
                                label="Category"
                                placeholder="Select Category..."
                                disabled={!buildingId}
                                options={categories.map((c) => ({ value: c.name, label: c.name }))}
                                value={category}
                                onChange={handleCategoryChange}
                            />
                            <SearchableSelect
                                label="Sub Category"
                                placeholder="Select Sub Category..."
                                disabled={!category}
                                options={filteredSubcategories.map((s) => ({ value: String(s.id), label: s.name }))}
                                value={subcategoryId}
                                onChange={setSubcategoryId}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label>Upload File</Label>
                                <div className={`flex flex-wrap items-center gap-2 ${!subcategoryId ? 'pointer-events-none opacity-50' : ''}`}>
                                    <div
                                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                                        onClick={() => subcategoryId && fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{file ? file.name : 'Choose file...'}</span>
                                    </div>
                                    {file && (
                                        <>
                                            <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); viewFile(); }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <Button type="button" onClick={(e) => { e.stopPropagation(); handleAdd(); }}>
                                                Add
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.xls,.xlsx,.csv,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <div />
                        </div>

                        {entries.length > 0 && (
                            <div className="space-y-2 rounded-md border p-3">
                                <p className="text-sm font-medium">Queued Documents ({entries.length})</p>
                                <div className="space-y-1">
                                    {entries.map((entry, i) => {
                                        const sub = subcategories.find((s) => s.id === Number(entry.subcategoryId))
                                        return (
                                            <div key={i} className="flex items-center justify-between rounded bg-muted/50 px-2 py-1 text-sm">
                                                <span className="truncate">
                                                    {entry.category} / {sub?.name || 'Unknown'} — {entry.file.name}
                                                </span>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEntry(i)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" asChild>
                                <Link href={index()}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={saving || entries.length === 0}>
                                {saving ? 'Saving...' : 'Submit Document'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closePreview}>
                    <div className="relative h-[90vh] w-[90vw]" onClick={(e) => e.stopPropagation()}>
                        <Button variant="destructive" size="icon" className="absolute -right-3 -top-3 z-10" onClick={closePreview}>
                            <X className="h-4 w-4" />
                        </Button>
                        <iframe src={previewUrl} className="h-full w-full rounded-lg border bg-white" />
                    </div>
                </div>
            )}
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Project Document', href: '/documents' },
        { title: 'Create', href: '/documents/create' },
    ],
}

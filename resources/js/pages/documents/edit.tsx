import { Head, Link, router, usePage } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SearchableSelect from '@/components/ui/searchable-select'
import { ArrowLeft, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { dashboard } from '@/routes'
import { index, edit, update } from '@/routes/documents'

interface Project {
    id: number
    name: string
}

interface Building {
    id: number
    name: string
    project_id: number
}

interface Document {
    id: number
    name: string
    file_path: string
    type: string
    category: string
    subcategory_id?: number
    project_id?: number
    building_id?: number
    project?: Project
    building?: Building
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
    document: Document
    projects: Project[]
    buildings: Building[]
    categories: Category[]
    subcategories: Subcategory[]
    existingDocs: ExistingDoc[]
}

export default function Edit() {
    const { document: doc, projects, buildings, categories, subcategories, existingDocs } = usePage<PageProps>().props
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(doc.name)
    const [file, setFile] = useState<File | null>(null)
    const [category, setCategory] = useState(doc.category || '')
    const [subcategoryId, setSubcategoryId] = useState(String(doc.subcategory_id || ''))
    const [projectId, setProjectId] = useState(String(doc.project_id || ''))
    const [buildingId, setBuildingId] = useState(String(doc.building_id || ''))
    const [processing, setProcessing] = useState(false)

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
                  (String(s.id) === subcategoryId || !usedSubcategoryIds.has(String(s.id))),
          )
        : []

    const detectedType = (() => {
        const source = file?.name || doc.file_path
        const ext = source.split('.').pop()?.toLowerCase()
        if (!ext) return doc.type || ''
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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        const data = new FormData()
        data.append('name', name)
        data.append('type', detectedType)
        data.append('category', category)
        data.append('subcategory_id', subcategoryId || '')
        data.append('project_id', projectId || '')
        data.append('building_id', buildingId || '')
        if (file) data.append('file', file)
        router.put(update(doc.id), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Document updated successfully')
            },
            onError: (errors) => {
                toast.error(Object.values(errors).join(', '))
            },
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <>
            <Head title="Edit Document" />

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
                    <CardTitle>Edit Document</CardTitle>
                    <CardDescription>Update document details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

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
                                        <span className="truncate">{file ? file.name : (doc.file_path || 'Choose file...')}</span>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.xls,.xlsx,.csv,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null
                                        setFile(f)
                                        if (f) {
                                            const sub = subcategories.find((s) => s.id === Number(subcategoryId))
                                            const baseName = f.name.split('.').shift() || 'Untitled'
                                            setName(sub ? `${baseName} - ${sub.name}` : baseName)
                                        }
                                    }}
                                />
                            </div>
                            <div />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" asChild>
                                <Link href={index()}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Document'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

Edit.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Project Document', href: index() },
        { title: 'Edit', href: edit({ document: props.document.id }) },
    ],
})

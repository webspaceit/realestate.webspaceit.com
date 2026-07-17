import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import SearchableSelect from '@/components/ui/searchable-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Search, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { index as indexRoute, edit, create, show as showRoute, destroy } from '@/routes/documents'

interface Project {
    id: number
    name: string
}

interface Building {
    id: number
    name: string
    project_id: number
}

interface User {
    id: number
    name: string
}

interface Document {
    id: number
    name: string
    file_path: string
    type: string
    category: string
    subcategory?: { id: number; name: string }
    project?: Project
    building?: Building
    uploaded_by: User
    created_at: string
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

interface PageProps {
    documents: { data: Document[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; links: { url: string | null; label: string; active: boolean }[] }
    filters: { project_id?: string; building_id?: string; category?: string; subcategory_id?: string; search?: string; per_page?: string }
    projects: Project[]
    buildings: Building[]
    categories: Category[]
    subcategories: Subcategory[]
}

export default function Index() {
    const { documents, filters, projects, buildings, categories, subcategories } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search || '')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [projectId, setProjectId] = useState(filters.project_id || '')
    const [buildingId, setBuildingId] = useState(filters.building_id || '')
    const [category, setCategory] = useState(filters.category || '')
    const [subcategoryId, setSubcategoryId] = useState(filters.subcategory_id || '')
    const [perPage, setPerPage] = useState(filters.per_page || '10')

    const filteredBuildings = projectId
        ? buildings.filter((b) => b.project_id === Number(projectId))
        : buildings

    const selectedCategory = categories.find((c) => c.name === category)
    const filteredSubcategories = selectedCategory
        ? subcategories.filter((s) => s.document_category_id === selectedCategory.id)
        : []

    function handleProjectChange(value: string) {
        setProjectId(value)
        if (value && buildingId && !buildings.find((b) => b.id === Number(buildingId) && b.project_id === Number(value))) {
            setBuildingId('')
        }
    }

    function handleCategoryChange(value: string) {
        setCategory(value)
        setSubcategoryId('')
    }

    function handleFilter() {
        router.get(
            indexRoute(),
            { search, project_id: projectId, building_id: buildingId, category, subcategory_id: subcategoryId, per_page: perPage },
            { preserveState: true, preserveScroll: true },
        )
    }

    function resetFilters() {
        setSearch('')
        setProjectId('')
        setBuildingId('')
        setCategory('')
        setSubcategoryId('')
        setPerPage('10')
        router.get(
            indexRoute(),
            { search: '', project_id: '', building_id: '', category: '', subcategory_id: '', per_page: '10' },
            { preserveState: true, preserveScroll: true },
        )
    }

    const slNo = (index: number) => (documents.current_page - 1) * documents.per_page + index + 1

    async function viewFile(filePath: string) {
        try {
            const res = await fetch(`/files/${filePath}`)
            const blob = await res.blob()
            setPreviewUrl(URL.createObjectURL(blob))
        } catch {
            toast.error('Failed to load file')
        }
    }

    function closePreview() {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
    }

    function handleDelete(documentId: number) {
        if (!confirm('Are you sure you want to delete this document?')) return
        router.delete(destroy(documentId), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Document deleted successfully'),
        })
    }

    return (
        <>
            <Head title="Project Document" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Project Document</h1>
                <Button asChild>
                    <Link href={create()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Document
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-56 space-y-1">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="w-56">
                            <SearchableSelect
                                label="Project"
                                placeholder="All Projects"
                                options={projects.map((p) => ({ value: String(p.id), label: p.name }))}
                                value={projectId}
                                onChange={handleProjectChange}
                            />
                        </div>
                        <div className="w-56">
                            <SearchableSelect
                                label="Building"
                                placeholder="All Buildings"
                                options={filteredBuildings.map((b) => ({ value: String(b.id), label: b.name }))}
                                value={buildingId}
                                onChange={setBuildingId}
                            />
                        </div>
                        <div className="w-56">
                            <SearchableSelect
                                label="Category"
                                placeholder="All Categories"
                                options={categories.map((c) => ({ value: c.name, label: c.name }))}
                                value={category}
                                onChange={handleCategoryChange}
                            />
                        </div>
                        <div className="w-56">
                            <SearchableSelect
                                label="Sub Category"
                                placeholder="All Sub Categories"
                                disabled={!category}
                                options={filteredSubcategories.map((s) => ({ value: String(s.id), label: s.name }))}
                                value={subcategoryId}
                                onChange={setSubcategoryId}
                            />
                        </div>
                        <div className="w-28 space-y-1">
                            <Label>Per Page</Label>
                            <Select value={perPage} onValueChange={setPerPage}>
                                <SelectTrigger id="per_page">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="150">150</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilter}>Search</Button>
                            <Button variant="outline" onClick={resetFilters}><RotateCcw className="mr-1 h-4 w-4" />Reset</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Sl.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Sub Category</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead className="w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                                            No documents found.
                                        </TableCell>
                                    </TableRow>
                            ) : (
                                documents.data.map((doc, i) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="text-muted-foreground">{slNo(i)}</TableCell>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{doc.type}</Badge>
                                        </TableCell>
                                        <TableCell>{doc.category}</TableCell>
                                        <TableCell>{doc.subcategory?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => viewFile(doc.file_path)}>
                                                <Eye className="mr-1 h-3 w-3" />
                                                View
                                            </Button>
                                        </TableCell>
                                        <TableCell>{doc.project?.name || '-'}</TableCell>
                                        <TableCell>{doc.uploaded_by.name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={showRoute(doc.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(doc.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {documents.last_page > 1 && (
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {documents.from || 0} to {documents.to || 0} of {documents.total}
                </p>
                    <div className="flex gap-1">
                        {documents.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, {}, { preserveState: true, preserveScroll: true })
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}

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

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Project Document', href: '/documents' },
    ],
}

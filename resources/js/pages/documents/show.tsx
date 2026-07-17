import { Head, Link, usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText } from 'lucide-react'
import { dashboard } from '@/routes'
import { index, show } from '@/routes/documents'
import files from '@/routes/files'
import DocumentViewer from '@/components/document-viewer'

interface Project {
    id: number
    name: string
}

interface Building {
    id: number
    name: string
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

interface PageProps {
    document: Document
}

export default function Show() {
    const { document: doc } = usePage<PageProps>().props

    return (
        <>
            <Head title={doc.name} />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={index()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Documents
                    </Link>
                </Button>
            </div>

            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{doc.name}</CardTitle>
                            <CardDescription>Uploaded on {new Date(doc.created_at).toLocaleDateString()}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <Badge variant="secondary" className="mt-1">
                                {doc.type}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="mt-1 font-medium">{doc.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sub Category</p>
                            <p className="mt-1 font-medium">{doc.subcategory?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Project</p>
                            <p className="mt-1 font-medium">{doc.project?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Building</p>
                            <p className="mt-1 font-medium">{doc.building?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Uploaded By</p>
                            <p className="mt-1 font-medium">{doc.uploaded_by.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">File Path</p>
                            <p className="mt-1 font-medium font-mono text-xs">{doc.file_path}</p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <DocumentViewer filePath={doc.file_path} label="View File" />
                        <Button asChild variant="outline">
                            <a href={files.show({ path: doc.file_path }).url} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

Show.layout = (props: PageProps) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Project Document', href: index() },
        { title: props.document.name, href: show({ document: props.document.id }) },
    ],
})

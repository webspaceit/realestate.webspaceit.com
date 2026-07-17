import { useState, useEffect } from 'react'
import { Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import files from '@/routes/files'

export default function DocumentViewer({ filePath, label }: { filePath: string | null; label: string }) {
    const [open, setOpen] = useState(false)
    const [blobUrl, setBlobUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !filePath) return
        setLoading(true)
        const url = files.show({ path: filePath }).url
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load file')
                return res.blob()
            })
            .then(blob => {
                setBlobUrl(URL.createObjectURL(blob))
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [open, filePath])

    useEffect(() => {
        if (!open && blobUrl) {
            URL.revokeObjectURL(blobUrl)
            setBlobUrl(null)
        }
    }, [open, blobUrl])

    if (!filePath) return <span className="text-muted-foreground">-</span>

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)

    return (
        <>
            <Button variant="link" className="h-auto p-0" onClick={() => setOpen(true)}>
                <Eye className="mr-1 h-4 w-4" />
                {label}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 h-[75vh] flex items-center justify-center">
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : blobUrl ? (
                            isImage ? (
                                <img src={blobUrl} alt={label} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <embed src={blobUrl} type="application/pdf" className="w-full h-full rounded border" />
                            )
                        ) : (
                            <p className="text-muted-foreground">Could not load file</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

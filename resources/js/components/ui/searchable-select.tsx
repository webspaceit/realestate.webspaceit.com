import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    label: string
    placeholder: string
    disabled?: boolean
    options: Option[]
    value: string
    onChange: (value: string) => void
}

export default function SearchableSelect({ label, placeholder, disabled, options, value, onChange }: SearchableSelectProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const selected = options.find(o => o.value === value)
    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open])

    return (
        <div className="space-y-1 relative" ref={containerRef}>
            <Label>{label}</Label>
            <div
                className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => { if (!disabled) { setOpen(!open) } }}
            >
                <span className={selected ? '' : 'text-muted-foreground'}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-50"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            </div>
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-1">
                        <Input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="h-8"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No results</div>
                        ) : (
                            filtered.map((o) => (
                                <div
                                    key={o.value}
                                    className={`flex cursor-pointer items-center px-2 py-1.5 text-sm rounded-sm ${o.value === value ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                    onClick={() => { onChange(o.value); setOpen(false); setSearch('') }}
                                >
                                    {o.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

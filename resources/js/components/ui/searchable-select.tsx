import { useState, useRef, useEffect } from 'react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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
        <div className="relative space-y-1" ref={containerRef}>
            {label && <Label>{label}</Label>}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="listbox"
                className={cn(
                    "border-input flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                    open && "border-ring ring-ring/50 ring-[3px]",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                <span className={cn('truncate', !selected && 'text-muted-foreground')}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </button>
            {open && (
                <div
                    className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border shadow-md"
                    role="listbox"
                >
                    <div className="p-1">
                        <Input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="h-8"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No results</div>
                        ) : (
                            filtered.map((o) => {
                                const isSelected = o.value === value
                                return (
                                    <div
                                        key={o.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => { onChange(o.value); setOpen(false); setSearch('') }}
                                        className={cn(
                                            "relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none",
                                            isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                                        )}
                                    >
                                        <span className="flex-1 truncate">{o.label}</span>
                                        {isSelected && (
                                            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                                                <CheckIcon className="size-4" />
                                            </span>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
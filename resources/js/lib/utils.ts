import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Format a date string or ISO timestamp as DD-MM-YYYY for display.
 * Keeps the value safe for HTML date inputs by NOT reformatting — use
 * fmtDateInput() for that instead.
 */
export function fmtDate(value: string | null | undefined): string {
    if (!value) return '-';
    const s = String(value).slice(0, 10); // get YYYY-MM-DD part
    const [y, m, d] = s.split('-');
    if (!y || !m || !d) return s;
    return `${d}-${m}-${y}`;
}

/**
 * Normalise a date value to YYYY-MM-DD for use in <input type="date">.
 */
export function fmtDateInput(value: string | null | undefined): string {
    if (!value) return '';
    return String(value).slice(0, 10);
}

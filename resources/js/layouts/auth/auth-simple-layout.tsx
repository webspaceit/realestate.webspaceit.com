import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { ArrowLeft } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-sidebar p-6 md:p-10">
            {/* Soft decorative backdrop echoing the brand */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-44 -right-44 size-[30rem] rounded-full bg-white/5"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-52 -left-36 size-[32rem] rounded-full bg-white/5"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            />

            <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
                    <div className="flex flex-col gap-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Home
                        </Link>

                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-3 font-medium"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl bg-sidebar shadow-md">
                                    <AppLogoIcon className="size-7 fill-current text-sidebar-foreground" />
                                </div>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-semibold">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {children}
                    </div>
                </div>

                <p className="mt-6 text-center text-xs tracking-wide text-sidebar-foreground/70">
                    {name}
                </p>
            </div>
        </div>
    );
}
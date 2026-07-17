import { Head, Link } from '@inertiajs/react';
import { login } from '@/routes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Welcome() {
    return (
        <>
            <Head title="WSIT Realestate" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
                <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 dark:border-gray-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">W</div>
                            <span className="font-semibold text-lg">WSIT Realestate</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none">
                                Login
                                <svg className="ml-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-44 p-1" align="end">
                                <DropdownMenuItem className="p-0">
                                    <Link href={login()} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900 dark:text-blue-300">A</span>
                                        Login as Admin
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-0">
                                    <Link href={login()} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold dark:bg-green-900 dark:text-green-300">M</span>
                                        Login as Manager
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-0">
                                    <Link href={login()} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold dark:bg-orange-900 dark:text-orange-300">S</span>
                                        Login as Staff
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center px-6">
                    <div className="text-center max-w-2xl">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mx-auto mb-6">W</div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            WSIT{' '}
                            <span className="text-primary">Realestate</span>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Building Construction Management System
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link href={login()} className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </main>

                <footer className="border-t bg-white/80 dark:bg-gray-950/80 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} WSIT Realestate. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}

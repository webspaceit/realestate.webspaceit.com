import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-sidebar-foreground/90">
                <span className="mb-0.5 truncate leading-tight font-semibold text-sidebar-foreground">
                    Real-Estate Management System
                </span>
            </div>
        </>
    );
}

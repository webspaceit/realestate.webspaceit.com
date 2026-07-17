import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Building2,
    CalendarCheck,
    ClipboardList,
    FileText,
    Flag,
    FolderGit2,
    Home,
    Layers,
    LayoutGrid,
    ListChecks,
    ListTree,
    Package,
    ShoppingCart,
    Truck,
    Users,
    UserCircle,
    List,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import bookings from '@/routes/bookings';
import buildings from '@/routes/buildings';
import flats from '@/routes/flats';
import phases from '@/routes/phases';
import milestones from '@/routes/milestones';
import projectTypes from '@/routes/project-types';
import projects from '@/routes/projects';
import tasks from '@/routes/tasks';
import contractors from '@/routes/contractors';
import contractorAssignments from '@/routes/contractor-assignments';
import specializations from '@/routes/specializations';
import suppliers from '@/routes/suppliers';
import users from '@/routes/users';
import materials from '@/routes/materials';
import inventory from '@/routes/inventory';
import budgets from '@/routes/budgets';
import expenses from '@/routes/expenses';
import documentCategories from '@/routes/document-categories';
import documents from '@/routes/documents';
import subcategories from '@/routes/subcategories';
import flatOwners from '@/routes/flat-owners';
import paymentTerms from '@/routes/payment-terms';
import type { NavItem } from '@/types';

const defaultNavItems: NavItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        id: 'users',
        title: 'Users',
        href: users.index().url,
        icon: Users,
    },
    {
        id: 'projects',
        title: 'Projects',
        href: projects.index().url,
        icon: FolderGit2,
        items: [
            { id: 'list-projects', title: 'List of Projects', href: projects.index().url, icon: List },
            { id: 'phases', title: 'Phases', href: phases.index().url, icon: ListChecks },
            { id: 'milestones', title: 'Milestones', href: milestones.index().url, icon: Flag },
            { id: 'project-types', title: 'Project Types', href: projectTypes.index().url, icon: ListTree },
        ],
    },
    {
        id: 'buildings',
        title: 'Buildings',
        href: buildings.index().url,
        icon: Building2,
    },
    {
        id: 'flats',
        title: 'Flats',
        href: flats.index().url,
        icon: Home,
    },
    {
        id: 'bulk-units',
        title: 'Bulk Units',
        href: flats.bulkIndex().url,
        icon: Layers,
    },
    {
        id: 'flat-bookings',
        title: 'Flat Bookings',
        href: bookings.index().url,
        icon: CalendarCheck,
    },
    {
        id: 'tasks',
        title: 'Tasks',
        href: tasks.index().url,
        icon: ClipboardList,
    },
    {
        id: 'contractors',
        title: 'Contractors',
        href: contractors.index().url,
        icon: Users,
        items: [
            { id: 'list-contractors', title: 'List of Contractors', href: contractors.index().url, icon: List },
            { id: 'assignments', title: 'Assignments', href: contractorAssignments.index().url, icon: ClipboardList },
            { id: 'specializations', title: 'Specializations', href: specializations.index().url, icon: List },
        ],
    },
    {
        id: 'suppliers',
        title: 'Suppliers',
        href: suppliers.index().url,
        icon: Truck,
    },
    {
        id: 'materials',
        title: 'Materials',
        href: materials.index().url,
        icon: Package,
    },
    {
        id: 'inventory',
        title: 'Inventory',
        href: inventory.index().url,
        icon: ShoppingCart,
    },
    {
        id: 'budgets',
        title: 'Budgets',
        href: budgets.index().url,
        icon: () => <span className="text-sm font-bold">৳</span>,
    },
    {
        id: 'expenses',
        title: 'Expenses',
        href: expenses.index().url,
        icon: () => <span className="text-sm font-bold">৳</span>,
    },
    {
        id: 'project-document',
        title: 'Project Document',
        href: documents.index().url,
        icon: FileText,
        items: [
            { id: 'list-documents', title: 'List of Documents', href: documents.index().url, icon: List },
            { id: 'category', title: 'Category', href: documentCategories.index().url, icon: List },
            { id: 'sub-categories', title: 'Sub Categories', href: subcategories.index().url, icon: List },
        ],
    },
    {
        id: 'flat-owners-detail',
        title: 'Flat Owners Detail',
        href: flatOwners.index().url,
        icon: UserCircle,
    },
    {
        id: 'payment-terms',
        title: 'Payment Terms',
        href: paymentTerms.index().url,
        icon: () => <span className="text-sm font-bold">৳</span>,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

    useEffect(() => {
        fetch('/sidebar-order')
            .then((res) => res.json())
            .then((data) => {
                if (data.order && data.order.length > 0) {
                    const map = new Map(defaultNavItems.map((i) => [i.id, i]));
                    const reordered = data.order.map((id: string) => map.get(id)).filter(Boolean) as NavItem[];
                    const remaining = defaultNavItems.filter((i) => !data.order.includes(i.id!));
                    setNavItems([...reordered, ...remaining]);
                }
            })
            .catch(() => {});
    }, []);

    function handleReorder(items: NavItem[]) {
        setNavItems(items);
        fetch('/sidebar-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' },
            body: JSON.stringify({ order: items.map((i) => i.id) }),
        }).catch(() => {});
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} onReorder={handleReorder} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

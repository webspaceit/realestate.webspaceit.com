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
    IdCard,
    Calendar,
    Wallet,
    BarChart3,
    GraduationCap,
    ClipboardCheck,
    Award,
    Car,
    Receipt,
    Briefcase,
    UserCog,
    Boxes,
    Settings,
    Banknote,
    Timer,
    Target,
    Gavel,
    Handshake,
    BookOpen,
    Calculator,
    FolderCog,
    Info,
    PartyPopper,
    Clock,
    ArrowLeftRight,
    Megaphone,
    TrendingUp,
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
import departments from '@/routes/departments';
import designations from '@/routes/designations';
import employees from '@/routes/employees';
import flats from '@/routes/flats';
import hr from '@/routes/hr';
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
        id: 'employees',
        title: 'HRM',
        href: employees.index().url,
        icon: Users,
        items: [
            { id: 'list-of-employee', title: 'List of Employee', href: employees.index().url, icon: List },
            { id: 'departments', title: 'Departments', href: departments.index().url, icon: Building2 },
            { id: 'designations', title: 'Designations', href: designations.index().url, icon: List },
            { id: 'employee-personal-info', title: 'Employee Personal Info', href: employees.create().url, icon: IdCard },
            { id: 'leave-application', title: 'Leave Application', href: hr.index('leave_applications').url, icon: Calendar },
            { id: 'responsibility', title: 'Responsibility', href: hr.index('responsibilities').url, icon: ClipboardList },
            { id: 'loan-application', title: 'Loan Application', href: hr.index('loan_applications').url, icon: Wallet },
            { id: 'attendance-sheet', title: 'Attendance Sheet', href: hr.index('attendance_sheets').url, icon: CalendarCheck },
            { id: 'attendance-report', title: 'Attendance Report/Summary', href: hr.index('attendance_reports').url, icon: BarChart3 },
            { id: 'e-learning', title: 'E-Learning', href: hr.index('e_learnings').url, icon: GraduationCap },
            { id: 'appraisal-apply', title: 'Appraisal Apply', href: hr.index('appraisal_applies').url, icon: ClipboardCheck },
            { id: 'achievement-entry', title: 'Achievement Entry', href: hr.index('achievements').url, icon: Award },
            { id: 'conveyance-entry', title: 'Conveyance Entry', href: hr.index('conveyance_entries').url, icon: Car },
            { id: 'pay-slip', title: 'Pay Slip', href: hr.index('pay_slips').url, icon: Receipt },
            { id: 'recruit-management', title: 'Recruit Management', href: hr.index('recruit_management').url, icon: Briefcase },
            { id: 'hr-consultant', title: 'HR Consultant', href: hr.index('hr_consultants').url, icon: UserCog },
            { id: 'asset-manage', title: 'Asset Manage', href: hr.index('asset_manage').url, icon: Boxes },
            { id: 'hr-info-system', title: 'HR Info System', href: hr.index('hr_info_system').url, icon: Settings },
            { id: 'payroll-manage', title: 'Payroll Manage', href: hr.index('payroll_manage').url, icon: Banknote },
            { id: 'attend-leave', title: 'Attend & Leave', href: hr.index('attend_leaves').url, icon: Timer },
            { id: 'perform-management', title: 'Perform Management', href: hr.index('performance_management').url, icon: Target },
            { id: 'discipline-management', title: 'Discipline Management', href: hr.index('discipline_management').url, icon: Gavel },
            { id: 'crm', title: 'Customer Relationship Management', href: hr.index('crm').url, icon: Handshake },
            { id: 'learning-management', title: 'Learning Management', href: hr.index('learning_management').url, icon: BookOpen },
            { id: 'accounts-fin', title: 'Accounts & Fin', href: hr.index('accounts_finance').url, icon: Calculator },
            { id: 'inventory-management', title: 'Inventory Management', href: inventory.index().url, icon: ShoppingCart },
            { id: 'administration', title: 'Administration', href: hr.index('administration').url, icon: FolderCog },
            { id: 'leave-information', title: 'Leave Information', href: hr.index('leave_information').url, icon: Info },
            { id: 'holiday', title: 'Holiday', href: hr.index('holidays').url, icon: PartyPopper },
            { id: 'shift', title: 'Shift', href: hr.index('shifts').url, icon: Clock },
            { id: 'employee-movement', title: 'Employee Movement', href: hr.index('employee_movements').url, icon: ArrowLeftRight },
            { id: 'office-notice', title: 'Office Notice', href: hr.index('office_notices').url, icon: Megaphone },
            { id: 'promotional-activities', title: 'Promotional Activities', href: hr.index('promotional_activities').url, icon: TrendingUp },
        ],
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

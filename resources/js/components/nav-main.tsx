import { Link } from '@inertiajs/react';
import { ChevronRight, GripVertical } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

function SortableNavItem({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id! });
    const hasSubItems = item.items && item.items.length > 0;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (!hasSubItems) {
        return (
            <SidebarMenuItem key={item.title}>
                <div ref={setNodeRef} style={style} className="flex items-center">
                    <button {...attributes} {...listeners} className="flex h-9 w-6 cursor-grab items-center justify-center text-white/50 hover:text-white active:cursor-grabbing">
                        <GripVertical className="h-3.5 w-3.5" />
                    </button>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl(item.href)}
                        tooltip={{ children: item.title }}
                        className="flex-1"
                    >
                        <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </div>
            </SidebarMenuItem>
        );
    }

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.items!.some(i => isCurrentUrl(i.href))}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <div ref={setNodeRef} style={style}>
                    <div className="flex items-center">
                        <button {...attributes} {...listeners} className="flex h-9 w-6 cursor-grab items-center justify-center text-white/50 hover:text-white active:cursor-grabbing">
                            <GripVertical className="h-3.5 w-3.5" />
                        </button>
                        <CollapsibleTrigger asChild className="flex-1">
                            <SidebarMenuButton tooltip={{ children: item.title }}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items!.map((sub) => (
                                <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton asChild isActive={isCurrentUrl(sub.href)}>
                                        <Link href={sub.href} prefetch>
                                            {sub.icon && <sub.icon />}
                                            <span>{sub.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </div>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function NavMain({ items = [], onReorder }: { items: NavItem[]; onReorder: (items: NavItem[]) => void }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = [...items];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        onReorder(reordered);
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext items={items.map((i) => i.id!)} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableNavItem key={item.id} item={item} />
                        ))}
                    </SortableContext>
                </DndContext>
            </SidebarMenu>
        </SidebarGroup>
    );
}

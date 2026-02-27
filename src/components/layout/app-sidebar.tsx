'use client';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems } from '@/config/nav-config';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSession } from 'next-auth/react';
import { useFilteredNavItems } from '@/hooks/use-nav';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
import { NavUser } from '../nav-user';

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { data: session } = useSession();
  const filteredItems = useFilteredNavItems(navItems);
  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>(
    {}
  );

  // Sync with localStorage and handle initial state
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsible-states');
    if (saved) {
      try {
        setOpenStates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse sidebar state', e);
      }
    }
  }, []);

  const handleOpenChange = (title: string, open: boolean) => {
    setOpenStates((prev) => {
      const next = { ...prev, [title]: open };
      localStorage.setItem('sidebar-collapsible-states', JSON.stringify(next));
      return next;
    });
  };

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  // Debug: Log session to console
  React.useEffect(() => {
    console.log('Session in AppSidebar:', session);
  }, [session]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const isChildActive = item.items?.some(
                (subItem) => subItem.url === pathname
              );
              const isOpen = openStates[item.title] ?? isChildActive;

              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  open={isOpen}
                  onOpenChange={(open) => handleOpenChange(item.title, open)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url || isChildActive}
                        className="hover:bg-primary/10 transition-colors duration-200"
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-0">
                        {item.items?.map((subItem, index) => {
                          const isSubItemActive = pathname === subItem.url;
                          const isLast = index === item.items!.length - 1;

                          if (subItem.isHeader) {
                            return (
                              <div
                                key={subItem.title}
                                className="text-muted-foreground/50 mt-3 mb-1 ml-4 text-[10px] font-bold tracking-wider uppercase"
                              >
                                {subItem.title}
                              </div>
                            );
                          }

                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className="relative"
                            >
                              <svg
                                className={cn(
                                  'absolute inset-y-0 -left-[12px] h-full w-4 transition-colors duration-300',
                                  isSubItemActive
                                    ? 'text-primary'
                                    : 'text-primary/30'
                                )}
                                viewBox="0 0 16 32"
                                preserveAspectRatio="none"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d={
                                    isLast
                                      ? 'M1 0 V16 H14'
                                      : 'M1 0 V32 M1 16 H14'
                                  }
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubItemActive}
                                className="hover:bg-primary/10 transition-colors duration-200"
                              >
                                <Link href={subItem.url} className="ml-3">
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className="hover:bg-primary/10 transition-colors duration-200"
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

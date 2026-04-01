'use client';

import * as React from 'react';
import {
  IconLink,
  IconExternalLink,
  IconDownload,
  IconFileText,
  IconFile,
  IconPhoto,
  IconBook,
  IconMap,
  IconUsers,
  IconBell,
  IconMail,
  IconPhone,
  IconGlobe,
  IconCalendar,
  IconSettings,
  IconHelp,
  IconCircle,
  IconSquare,
  IconStar,
  IconHeart,
  IconHome,
  IconSearch,
  IconUser,
  IconMessage,
  IconVideo,
  IconMusic,
  IconCloud,
  IconCheck,
  IconX,
  IconBuilding,
  IconInfoCircle,
  IconNews,
  IconLayoutDashboard,
  IconChevronDown,
  IconDroplet,
  IconPackage,
  IconTrash,
  IconEdit,
  IconPlus,
  IconMinus,
  IconFilter,
  IconUpload,
  IconLock,
  IconEye,
  IconArrowRight,
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconMenu,
  IconCopy,
  IconShare2,
  IconClock,
  IconActivity,
  IconTrendingUp,
  IconBarChart2,
  IconPieChart,
  IconDatabase,
  IconSun,
  IconMoon,
  IconLogout,
  IconUserCircle,
  IconShield,
  IconAlertTriangle,
  IconRefresh,
  IconRotate
} from '@tabler/icons-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Map of icon names to components
export const ICON_LIST = {
  // Links & Navigation
  link: IconLink,
  'external-link': IconExternalLink,
  globe: IconGlobe,
  home: IconHome,

  // Files & Documents
  download: IconDownload,
  'file-down': IconFile,
  'file-text': IconFileText,
  file: IconFile,
  photo: IconPhoto,
  book: IconBook,
  books: IconBook,

  // Communication
  mail: IconMail,
  phone: IconPhone,
  message: IconMessage,

  // Organization & Location
  map: IconMap,
  users: IconUsers,
  user: IconUser,
  building: IconBuilding,

  // Categories & Tags
  tag: IconSquare,
  bell: IconBell,

  // Media & Entertainment
  video: IconVideo,
  music: IconMusic,
  cloud: IconCloud,

  // Actions & Tools
  settings: IconSettings,
  help: IconHelp,
  search: IconSearch,
  filter: IconFilter,
  edit: IconEdit,
  trash: IconTrash,
  plus: IconPlus,
  minus: IconMinus,
  upload: IconUpload,
  lock: IconLock,
  eye: IconEye,
  copy: IconCopy,
  share: IconShare2,

  // Arrows & Navigation
  'arrow-right': IconArrowRight,
  'arrow-left': IconArrowLeft,
  'arrow-up': IconArrowUp,
  'arrow-down': IconArrowDown,
  chevron: IconChevronDown,

  // Time & Status
  clock: IconClock,
  calendar: IconCalendar,
  activity: IconActivity,
  'trending-up': IconTrendingUp,
  news: IconNews,
  dashboard: IconLayoutDashboard,

  // Data & Analytics
  'bar-chart': IconBarChart2,
  'pie-chart': IconPieChart,
  database: IconDatabase,

  // UI & System
  circle: IconCircle,
  square: IconSquare,
  star: IconStar,
  heart: IconHeart,
  sun: IconSun,
  moon: IconMoon,
  logout: IconLogout,
  'user-circle': IconUserCircle,
  shield: IconShield,
  'alert-triangle': IconAlertTriangle,
  refresh: IconRefresh,
  rotate: IconRotate,
  droplet: IconDroplet,
  package: IconPackage
} as const;

export type IconName = keyof typeof ICON_LIST;

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function IconPicker({
  value,
  onChange,
  placeholder = 'Select an icon',
  className
}: IconPickerProps) {
  const [open, setOpen] = React.useState(false);

  const SelectedIcon =
    value && ICON_LIST[value as IconName] ? ICON_LIST[value as IconName] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            {SelectedIcon ? (
              <SelectedIcon className="h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <div className="h-4 w-4 shrink-0 opacity-50" />
            )}
            <span className="truncate">{value ? value : placeholder}</span>
          </div>
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <ScrollArea className="h-72">
          <div className="grid grid-cols-4 gap-1 p-2">
            {Object.entries(ICON_LIST).map(([name, Icon]) => (
              <Button
                key={name}
                variant="ghost"
                className={cn(
                  'flex h-12 w-full flex-col items-center justify-center gap-1 p-0 px-1',
                  value === name && 'bg-accent text-accent-foreground'
                )}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                title={name}
              >
                <Icon className="h-5 w-5" />
                <span className="w-full truncate text-center text-[10px]">
                  {name}
                </span>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="text-muted-foreground flex h-12 w-full flex-col items-center justify-center gap-1 p-0"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded border border-dashed text-[10px]">
                Ø
              </div>
              <span className="w-full truncate text-center text-[10px]">
                None
              </span>
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

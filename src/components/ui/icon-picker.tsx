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
  IconChevronDown
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
  link: IconLink,
  'external-link': IconExternalLink,
  download: IconDownload,
  'file-text': IconFileText,
  file: IconFile,
  photo: IconPhoto,
  book: IconBook,
  map: IconMap,
  users: IconUsers,
  bell: IconBell,
  mail: IconMail,
  phone: IconPhone,
  globe: IconGlobe,
  calendar: IconCalendar,
  settings: IconSettings,
  help: IconHelp,
  circle: IconCircle,
  square: IconSquare,
  star: IconStar,
  heart: IconHeart,
  home: IconHome,
  search: IconSearch,
  user: IconUser,
  message: IconMessage,
  video: IconVideo,
  music: IconMusic,
  cloud: IconCloud,
  check: IconCheck,
  x: IconX
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

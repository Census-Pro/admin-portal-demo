import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'next-auth';
import { IconUser } from '@tabler/icons-react';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: User | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
        <AvatarFallback className="rounded-lg">
          <IconUser className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          {/* Name removed as requested */}
          <span className="text-muted-foreground truncate text-xs">
            {user?.cidNo ? `CID: ${user.cidNo}` : user?.email || ''}
          </span>
          {user?.roleType && (
            <span className="text-muted-foreground truncate text-[10px] font-medium uppercase">
              {user.roleType.replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export default function ToolbarButton({
  icon: Icon,
  tooltip,
  isActive,
  className,
  ...props
}: {
  icon: LucideIcon;
  tooltip: string;
  isActive?: boolean;
} & ButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          data-active={isActive}
          className={cn(
            'data-[active=true]:bg-primary/10 data-[active=true]:text-primary text-foreground hover:bg-secondary rounded [&_svg]:text-inherit',
            className,
          )}
          {...props}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function ToolbarGroup({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/toolbar-group relative hidden has-[button]:flex',
        className,
      )}
    >
      <div className="flex items-center gap-0.5">{children}</div>
      <div className="mx-1.5 py-0.5 group-last/toolbar-group:hidden!">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
}

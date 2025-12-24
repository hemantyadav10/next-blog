import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

function NavigationButton({
  onClick,
  disabled,
  title,
  Icon,
}: {
  onClick: () => void;
  disabled: boolean;
  title: string;
  Icon: LucideIcon;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={onClick}
          disabled={disabled}
          aria-label={title}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );
}

export default NavigationButton;

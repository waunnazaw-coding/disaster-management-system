import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityConfig = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800'
};

interface RequestPriorityBadgeProps {
  priority: keyof typeof priorityConfig;
  className?: string;
}

export const RequestPriorityBadge = ({
  priority,
  className
}: RequestPriorityBadgeProps) => {
  return (
    <Badge className={cn(priorityConfig[priority], className)}>
      {priority}
    </Badge>
  );
};
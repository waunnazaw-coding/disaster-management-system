import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Check
} from 'lucide-react';

const statusConfig = {
  Pending: {
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  Approved: {
    icon: Check,
    className: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600'
  },
  InProgress: {
    icon: AlertCircle,
    className: 'bg-purple-100 text-purple-800',
    iconColor: 'text-purple-600'
  },
  Fulfilled: {
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800',
    iconColor: 'text-green-600'
  },
  Rejected: {
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
    iconColor: 'text-red-600'
  }
};

interface RequestStatusBadgeProps {
  status: keyof typeof statusConfig;
  className?: string;
}

export const RequestStatusBadge = ({
  status,
  className
}: RequestStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, className)}>
      <Icon className={cn('h-3 w-3 mr-1', config.iconColor)} />
      <span>{status}</span>
    </Badge>
  );
};
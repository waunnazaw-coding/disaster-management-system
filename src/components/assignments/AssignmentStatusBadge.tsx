// components/assignments/AssignmentStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const statusConfig = {
  Assigned: {
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  InProgress: {
    icon: AlertCircle,
    className: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600'
  },
  Done: {
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800',
    iconColor: 'text-green-600'
  },
  Cancelled: {
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
    iconColor: 'text-red-600'
  }
};

interface AssignmentStatusBadgeProps {
  status: keyof typeof statusConfig;
  className?: string;
}

export const AssignmentStatusBadge = ({
  status,
  className
}: AssignmentStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.Assigned;
  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, className)}>
      <Icon className={cn('h-3 w-3 mr-1', config.iconColor)} />
      <span>{status}</span>
    </Badge>
  );
};
// src/components/shared/PriorityIndicator.tsx
import { cn } from "@/lib/utils";

interface PriorityIndicatorProps {
  priority: "Low" | "Medium" | "High" | "Critical";
  size?: "sm" | "md";
}

export const PriorityIndicator = ({ priority, size = "md" }: PriorityIndicatorProps) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case "Low":
        return "bg-emerald-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-orange-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={cn(
      "rounded-full",
      size === "md" ? "w-5 h-5" : "w-3 h-3"
    )}>
      <div className={cn(
        "w-full h-full rounded-full animate-pulse",
        getPriorityStyles()
      )} />
    </div>
  );
};
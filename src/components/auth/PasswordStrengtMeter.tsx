"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  strength: number;
  className?: string;
}

export const PasswordStrengthMeter = ({ strength, className }: PasswordStrengthMeterProps) => {
  const strengthText = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ][strength] || "Very Weak";

  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ][strength] || "bg-gray-200";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Password Strength:</span>
        <span className="font-medium capitalize">{strengthText}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 w-full rounded-full",
              i <= strength ? strengthColor : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
    </div>
  );
};
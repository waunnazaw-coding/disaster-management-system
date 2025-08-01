"use client";

import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        {...props}
        className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  return <option value={value}>{children}</option>;
}

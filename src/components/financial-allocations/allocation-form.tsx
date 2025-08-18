import React, { useState, useEffect } from "react";
import type { FinancialAllocationRequestDto } from "@/types/financial-allocations";
import { FinancialAllocationSchema, FinancialAllocationInput } from "@/schemas/financialAllocationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AllocationFormProps {
  onSubmit: (data: FinancialAllocationRequestDto) => Promise<void>;
  onSubmitSuccess?: () => void; // optional, call on successful submit
  onCancel: () => void;
  initialData?: Partial<FinancialAllocationInput>;
  isEditing?: boolean;
}

export function AllocationForm({
  onSubmit,
  onSubmitSuccess,
  onCancel,
  initialData,
  isEditing = false,
}: AllocationFormProps) {
  const [formData, setFormData] = useState<FinancialAllocationInput>({
    allocationTypeName: initialData?.allocationTypeName || "",
    amount: initialData?.amount || 0,
    allocationDate: initialData?.allocationDate || new Date().toISOString().split("T")[0],
    notes: initialData?.notes ?? "",
    detailName: initialData?.detailName || "",
    detailDescription: initialData?.detailDescription ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FinancialAllocationInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Update formData if initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        allocationTypeName: initialData.allocationTypeName || "",
        amount: initialData.amount || 0,
        allocationDate: initialData.allocationDate || new Date().toISOString().split("T")[0],
        notes: initialData.notes ?? "",
        detailName: initialData.detailName || "",
        detailDescription: initialData.detailDescription ?? "",
      });
    }
  }, [initialData]);

  const allocationTypes = ["Direct Program Support", "Administrative Costs", "Fundraising Expenses"];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    // Trim strings before validation
    const trimmedData = {
      ...formData,
      allocationTypeName: formData.allocationTypeName.trim(),
      detailName: formData.detailName.trim(),
      detailDescription: formData.detailDescription?.trim() ?? "",
      notes: formData.notes?.trim() ?? "",
    };

    // Validate with Zod schema, ensure allocationDate is ISO string
    const parseResult = FinancialAllocationSchema.safeParse({
      ...trimmedData,
      allocationDate: new Date(formData.allocationDate).toISOString(),
    });

    if (!parseResult.success) {
      const fieldErrors: Partial<Record<keyof FinancialAllocationInput, string>> = {};
      parseResult.error.issues.forEach(({ path, message }) => {
        const field = path[0] as keyof FinancialAllocationInput;
        fieldErrors[field] = message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parseResult.data as FinancialAllocationRequestDto);
      onSubmitSuccess && onSubmitSuccess();
    } catch (error: any) {
      setFormError(error.message || "Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit" : "Create"} Financial Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (MMK)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step={1000}
                min={0}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="Enter amount in MMK"
                required
                aria-describedby={errors.amount ? "amount-error" : undefined}
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <p id="amount-error" className="text-destructive text-sm mt-1">{errors.amount}</p>}
              {formData.amount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Preview: {formatCurrency(formData.amount)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allocationTypeName">Allocation Type</Label>
              <Select
                value={formData.allocationTypeName}
                onValueChange={(value) => setFormData({ ...formData, allocationTypeName: value })}
                aria-describedby={errors.allocationTypeName ? "allocationTypeName-error" : undefined}
                aria-invalid={!!errors.allocationTypeName}
              >
                <SelectTrigger id="allocationTypeName">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {allocationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.allocationTypeName && (
                <p id="allocationTypeName-error" className="text-destructive text-sm mt-1">{errors.allocationTypeName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="allocationDate">Allocation Date</Label>
              <Input
                id="allocationDate"
                type="date"
                value={formData.allocationDate.split("T")[0]}
                onChange={(e) => setFormData({ ...formData, allocationDate: e.target.value })}
                required
                aria-describedby={errors.allocationDate ? "allocationDate-error" : undefined}
                aria-invalid={!!errors.allocationDate}
              />
              {errors.allocationDate && (
                <p id="allocationDate-error" className="text-destructive text-sm mt-1">{errors.allocationDate}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="detailName">Detail Name</Label>
            <Input
              id="detailName"
              type="text"
              value={formData.detailName}
              onChange={(e) => setFormData({ ...formData, detailName: e.target.value })}
              required
              aria-describedby={errors.detailName ? "detailName-error" : undefined}
              aria-invalid={!!errors.detailName}
            />
            {errors.detailName && <p id="detailName-error" className="text-destructive text-sm mt-1">{errors.detailName}</p>}
          </div>

          <div>
            <Label htmlFor="detailDescription">Detail Description</Label>
            <Textarea
              id="detailDescription"
              value={formData.detailDescription ?? ""}
              onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
              placeholder="Optional description"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes ?? ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </div>

          {formError && <p className="text-destructive text-center">{formError}</p>}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"} Allocation
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

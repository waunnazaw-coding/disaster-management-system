import { z } from "zod";

export const FinancialAllocationSchema = z.object({
  allocationTypeName: z.string().min(1, "Allocation type is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  allocationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  createdBy: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  detailName: z.string().min(1, "Detail Name is required"),
  detailDescription: z.string().nullable().optional(),
});

export type FinancialAllocationInput = z.infer<typeof FinancialAllocationSchema>;

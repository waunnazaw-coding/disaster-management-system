import { z } from "zod"

export const impactSchema = z.object({
  type: z.string().min(1, "Impact type is required"),
  value: z.string().optional().nullable(),
  objectName: z.string().optional().nullable(),
})

export const disasterReportSchema = z.object({
  // Location fields
  locationName: z.string().min(1, "Location name is required"),
  address: z.string().optional().nullable(),
  region: z.string().min(1, "Region is required"),
  country: z.string().optional().nullable(),
  geoJson: z.string().min(1, "Location coordinates are required"),
  addressDetail: z.string().optional().nullable(),

  // Disaster information
  type: z.string().min(1, "Disaster type is required"),
  title: z.string().min(1, "Report title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.string().min(1, "Severity level is required"),
  source: z.string().optional().nullable(),
  status: z.string().optional().nullable(),

  // Files and impacts
  reportPhotos: z.array(z.instanceof(File)).default([]),
  newPhotoDescription: z.array(z.string()).default([]),
  impactsJson: z.string().default("[]"),

  // Additional form fields for better UX
  disasterDate: z.string().min(1, "Disaster date is required"),

  // Impact numbers (optional but validated if provided)
  casualties: z.string().optional(),
  injuries: z.string().optional(),
  peopleDisplaced: z.string().optional(),
  peopleAffected: z.string().optional(),
  housesDestroyed: z.string().optional(),
  housesPartiallyDamaged: z.string().optional(),
  infrastructureDamage: z.string().optional(),
  economicLoss: z.string().optional(),
  additionalInfo: z.string().optional(),
})

export type DisasterReportFormData = z.infer<typeof disasterReportSchema>

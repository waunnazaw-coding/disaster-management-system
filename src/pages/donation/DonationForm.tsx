"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  CreditCard,
  Package,
  User,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import {
  donationService,
  type CreateDonationDto,
} from "../../api/donationService";
import kpayLogo from "./images/kpay.png";
import wavepayLogo from "./images/wavepay.png";

// ✅ Updated Zod schema (removed paymentAccountName & paymentPhoneNumber)
const donationSchema = z
  .object({
    name: z.string().min(1, "Donation name is required"),
    type: z.string().refine((val) => val === "Money" || val === "Item", {
      message: "Please select donation type",
    }),
    description: z.string().optional(),
    sourceType: z
      .string()
      .refine(
        (val) =>
          ["Personal", "Organization", "NGO", "Anonymous", "Company"].includes(
            val
          ),
        {
          message: "Please select source type",
        }
      ),
    amount: z.coerce.number().optional(),
    currency: z.string().optional(),
    paymentMethod: z.string().optional(),
    quantity: z.coerce.number().optional(),
    unit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Money") {
      if (!data.amount || data.amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount is required and must be greater than 0",
          path: ["amount"],
        });
      }
      if (!data.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required for money donations",
          path: ["currency"],
        });
      }
      if (!data.paymentMethod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Payment method is required for money donations",
          path: ["paymentMethod"],
        });
      }
    }

    if (data.type === "Item") {
      if (!data.quantity || data.quantity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity is required and must be greater than 0",
          path: ["quantity"],
        });
      }
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Unit is required for item donations",
          path: ["unit"],
        });
      }
    }
  });

type DonationFormInputs = z.infer<typeof donationSchema>;

export default function DonationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DonationFormInputs>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      currency: "MMK",
      type: "",
      sourceType: "",
    },
  });

  const donationType = watch("type");
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: DonationFormInputs) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      const donationData: CreateDonationDto = {
        type: data.type as "Money" | "Item",
        name: data.name,
        description: data.description || undefined,
        sourceType: data.sourceType as
          | "Personal"
          | "Organization"
          | "NGO"
          | "Anonymous"
          | "Company",
      };

      if (data.type === "Money") {
        donationData.amount = data.amount;
        donationData.currency = data.currency;
        donationData.paymentMethod = data.paymentMethod as
          | "KPay"
          | "WavePay"
          | "BankTransfer";
      } else if (data.type === "Item") {
        donationData.quantity = data.quantity;
        donationData.unit = data.unit;
      }

      const result = await donationService.createDonation(donationData);
      toast.success(
        "Donation submitted successfully! Thank you for your generosity."
      );
      reset();
      navigate("/profile?tab=donations");
    } catch (error: any) {
      console.error("Donation submission error:", error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to submit donation. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <Gift className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
          <p className="text-gray-600 mt-2">
            Your contribution helps us provide essential support during
            disasters and emergencies.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Donation Type */}
              <div className="space-y-3">
                <Label>Donation Type *</Label>
                <RadioGroup
                  value={donationType}
                  onValueChange={(value) => setValue("type", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Money" id="money" />
                    <Label
                      htmlFor="money"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Money Donation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Item" id="item" />
                    <Label
                      htmlFor="item"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Package className="h-4 w-4" />
                      Item Donation
                    </Label>
                  </div>
                </RadioGroup>
                {errors.type && (
                  <p className="text-red-600 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Donation Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Donation Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Relief Fund, Medical Supplies, etc."
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about your donation..."
                  rows={3}
                  {...register("description")}
                />
              </div>

              {/* Money Donation Fields */}
              {donationType === "Money" && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Money Donation Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                      />
                      {errors.amount && (
                        <p className="text-red-600 text-sm">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={watch("currency")}
                        onValueChange={(value) => setValue("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MMK">
                            MMK (Myanmar Kyat)
                          </SelectItem>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-red-600 text-sm">
                          {errors.currency.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>Payment Method *</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setValue("paymentMethod", value)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="KPay" id="kpay" />
                        <Label
                          htmlFor="kpay"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <img src={kpayLogo} alt="KPay" className="h-5 w-5" />
                          KPay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="WavePay" id="wavepay" />
                        <Label
                          htmlFor="wavepay"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <img
                            src={wavepayLogo}
                            alt="Wave Pay"
                            className="h-5 w-5"
                          />
                          Wave Pay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BankTransfer" id="bank" />
                        <Label htmlFor="bank" className="cursor-pointer">
                          Bank Transfer
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.paymentMethod && (
                      <p className="text-red-600 text-sm">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Admin payment info */}
                  {paymentMethod === "KPay" && (
                    <Alert>
                      <AlertDescription>
                        <p>
                          <strong>KPay Account Name:</strong> Admin Name
                        </p>
                        <p>
                          <strong>KPay Number:</strong> 09xxxxxxxxx
                        </p>
                        <p>
                          Please send your donation and keep your receipt for
                          verification.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentMethod === "WavePay" && (
                    <Alert>
                      <AlertDescription>
                        <p>
                          <strong>WavePay Account Name:</strong> Admin Name
                        </p>
                        <p>
                          <strong>WavePay Number:</strong> 09yyyyyyyyy
                        </p>
                        <p>
                          Please send your donation and keep your receipt for
                          verification.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentMethod === "BankTransfer" && (
                    <Alert>
                      <AlertDescription>
                        <p>
                          <strong>Bank Name:</strong> XYZ Bank
                        </p>
                        <p>
                          <strong>Account Name:</strong> Admin Name
                        </p>
                        <p>
                          <strong>Account Number:</strong> 123-456-789
                        </p>
                        <p>
                          Please transfer and keep your receipt. We will verify
                          your donation manually.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Item Donation Fields */}
              {donationType === "Item" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Item Donation Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        {...register("quantity")}
                      />
                      {errors.quantity && (
                        <p className="text-red-600 text-sm">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Input
                        id="unit"
                        placeholder="e.g., pieces, boxes, kg, etc."
                        {...register("unit")}
                      />
                      {errors.unit && (
                        <p className="text-red-600 text-sm">
                          {errors.unit.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Source Type */}
              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select
                  value={watch("sourceType")}
                  onValueChange={(value) => setValue("sourceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal
                      </div>
                    </SelectItem>
                    <SelectItem value="Organization">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Organization
                      </div>
                    </SelectItem>
                    <SelectItem value="NGO">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        NGO
                      </div>
                    </SelectItem>
                    <SelectItem value="Company">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company
                      </div>
                    </SelectItem>
                    <SelectItem value="Anonymous">Anonymous</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sourceType && (
                  <p className="text-red-600 text-sm">
                    {errors.sourceType.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Donation"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

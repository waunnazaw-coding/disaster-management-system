"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LockKeyhole, Mail } from "lucide-react";

const acceptSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  email: z.string().email("Please enter a valid email address"),
});

type AcceptFormData = z.infer<typeof acceptSchema>;

export const AcceptAdminInviteForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<AcceptFormData>({
    resolver: zodResolver(acceptSchema),
  });

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    if (!token || !email) {
      setTokenValid(false);
      toast.error("Invalid invite link", {
        description: "Missing required parameters in URL",
      });
      return;
    }
    
    setValue("token", token);
    setValue("email", email);
  }, [searchParams, setValue]);

  const onSubmit = async (data: AcceptFormData) => {
    try {
      setIsSubmitting(true);

      console.log("Accepting admin invite with data:", data);
      const response = await authService.acceptAdminInvite(data);

      
      toast.success("Admin account activated!", {
        description: "You can now access the admin dashboard",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to accept invite", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invite Link</CardTitle>
            <CardDescription>
              The admin invite link is missing required parameters.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
              <LockKeyhole className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Accept Admin Invite</CardTitle>
          <CardDescription className="text-center">
            Set your password to activate admin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  readOnly
                  className="pl-10 bg-gray-100 dark:bg-gray-800"
                  {...register("email")}
                />
              </div>
            </div>

            {/* New Password field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password*</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter a strong password"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Hidden token field */}
            <input type="hidden" {...register("token")} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Activating...
                </>
              ) : (
                "Activate Admin Account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
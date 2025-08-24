import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, AlertTriangle, MapPin,Heart, Mail, Lock } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema
const ResetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get("token") || "";
  const emailFromQuery = params.get("email") || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: emailFromQuery,
      token: tokenFromQuery,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (emailFromQuery) setValue("email", emailFromQuery);
    if (tokenFromQuery) setValue("token", tokenFromQuery);
  }, [emailFromQuery, tokenFromQuery, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
  const payload = {
    email: data.email,
    token: tokenFromQuery,
    newPassword: data.newPassword,
  };

  try {
      const result = await authService.resetPassword(payload);
    toast.success(result.message || "Password reset successfully! You can now sign in.");
    console.log("Reset success, navigating to login");
      navigate(`/login?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password. Please try again.");
      console.error("Reset password error:", error);
    }
  };



  if (!tokenFromQuery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-lg border-orange-200">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-red-600 text-center">
              Invalid or missing reset token. Please check your reset link or request a new password reset.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg border-orange-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
              <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold text-gray-900 dark:text-white">
            Reset Emergency Access
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Secure your disaster response account with a new password
          </CardDescription>

          {/* Feature display */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-800 dark:text-orange-300"> Emergency Response</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-800 dark:text-orange-300">Disaster Preparedness</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <MapPin className="h-4 w-4 text-orange-800" />
              <span className="text-xs text-orange-800 dark:text-orange-300">Resource Map</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Heart className="h-4 w-4 text-orange-800" />
              <span className="text-xs text-orange-800 dark:text-orange-300">Relief Operations</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="responder@emergency.gov"
                  className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  className="pl-10 pr-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  {...register("newPassword")}
                  aria-invalid={!!errors.newPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters with uppercase, lowercase,
                number, and special character
              </p>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirm  Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <input type="hidden" {...register("token")} value={tokenFromQuery} />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Reseting...
                </>
              ) : (
                "Reset  Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure access to emergency response operations and disaster management tools
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authService } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      await authService.register(data);
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user.name, user.profile || "User");
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed");
      return;
    }
    
    try {
      setIsGoogleLoading(true);
      const data = await authService.googleLogin({ 
        idToken: credentialResponse.credential 
      });
      setUser(data.user.name, data.user.profile || "User");
      toast.success("Google sign in successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to authenticate with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("max-w-md w-full mx-auto", className)} {...props}>
      <Card className="shadow-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our disaster response network
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Google Sign In */}
            <div className="flex flex-col gap-2">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Google sign in failed")}
                useOneTap
                size="large"
                text="signup_with"
                shape="rectangular"
              />
              {isGoogleLoading && (
                <p className="text-sm text-center text-muted-foreground">
                  Authenticating...
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
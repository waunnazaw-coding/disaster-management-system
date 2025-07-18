import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authService } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

// Define Zod schema for form validation
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  // Manual signup handler
  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      await authService.register(data);
      const user = await authService.getCurrentUser();
      if (user) setUser(user.name, user.profile || "User");
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please check your details and try again.");
    }
  };

  // Google signup/login handler
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed: No credential returned");
      return;
    }
    try {
      const data = await authService.googleLogin({ idToken: credentialResponse.credential });
      setUser(data.user.name, data.user.profile || "User");
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              {/* Google Login */}
              <div className="flex flex-col gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  useOneTap
                />
              </div>

              {/* Divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Name */}
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p role="alert" className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="m@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p role="alert" className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                required
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p role="alert" className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>

              {/* Link to login */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

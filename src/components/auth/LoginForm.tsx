import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { authService } from "../../api/auth";
import { useHandleToken } from "../../hooks/useHandleToken";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const handleToken = useHandleToken();
  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: LoginFormInputs) => {
      try {
        const response = await authService.login(data);
        if (response.accessToken) {
          handleToken(response.accessToken);
          toast.success("Login successful!");
        } else {
          throw new Error("No token received");
        }
      } catch {
        toast.error("Invalid email or password");
      }
    },
    [handleToken]
  );

  const handleGoogleLoginSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        toast.error("Google login failed: No credential returned");
        return;
      }
      try {
        const response = await authService.googleLogin({
          idToken: credentialResponse.credential,
        });
        if (response.accessToken) {
          handleToken(response.accessToken);
          toast.success("Logged in with Google!");
        } else {
          throw new Error("No token received");
        }
      } catch {
        toast.error("Google login failed. Please try again.");
      }
    },
    [handleToken]
  );

  const handleGoogleLoginError = useCallback(() => {
    toast.error("Google login failed. Please try again.");
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
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

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Signup link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

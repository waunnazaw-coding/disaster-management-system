"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Users, Package, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Activity, Shield } from "lucide-react"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { authService } from "@/api/auth"
import { useHandleToken } from "@/hooks/useHandleToken"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import {Link, useNavigate} from "react-router-dom"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const handleToken = useHandleToken()
  useAuthRedirect()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  })

  const onSubmit = useCallback(
    async (data: LoginFormInputs) => {
      try {
        const response = await authService.login(data)
        if (response.accessToken) {
          handleToken(response.accessToken)
          toast.success("Welcome back! You have successfully signed in to your account.")        
        } else {
          throw new Error("No token received")
        }
      } catch (error: any) {
        let errorMessage = "We couldn't sign you in. Please check your credentials and try again."

        if (error?.response?.status === 500) {
          errorMessage = "Incorrect email or password. Please double-check your credentials."
        } else if (error?.response?.status === 429) {
          errorMessage = "Too many login attempts. Please wait a few minutes before trying again."
        } else if (error?.response?.status >= 500) {
          errorMessage = "Our servers are experiencing issues. Please try again in a few moments."
        }

        toast.error(errorMessage)
      }
    },
    [handleToken, toast],
  )

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
      {/* Left Panel - Illustration and Features */}
      <div className="lg:w-1/2 bg-gradient-to-br from-orange-600 to-red-600 p-8 flex flex-col justify-center text-white">
  <div className="max-w-md mx-auto">
    <div className="flex items-center gap-3 mb-8">
      <div className="bg-white/20 p-3 rounded-full">
        <Shield className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold">Disaster Recovery Platform</h1>
    </div>

    <p className="text-orange-100 mb-8 text-lg leading-relaxed">
      Get instant alerts, coordinate recovery efforts, and manage resources during emergencies with our
      comprehensive disaster management system.
    </p>

    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-2 rounded-full mt-1">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Real-time Alerts</h3>
          <p className="text-orange-100 text-sm">
            Receive immediate notifications about emergencies in your area.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-2 rounded-full mt-1">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Team Coordination</h3>
          <p className="text-orange-100 text-sm">Coordinate response teams and volunteers effectively.</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-2 rounded-full mt-1">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Resource Management</h3>
          <p className="text-orange-100 text-sm">Track and allocate resources where they're needed most.</p>
        </div>
      </div>
    </div>

    {/* Button to return to home page */}
    <div className="mt-10 text-center">
      <button
        onClick={() => navigate('/')}
        className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-100 transition"
      >
        Back to Home Page
      </button>
    </div>
  </div>
</div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                  aria-pressed={activeTab === "login"}
                >
                  Login
                </button>
                <Link to="/signup" className="flex-1">
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                    aria-pressed={activeTab === "signup"}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>

               <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-gray-600">Sign in to access your disaster recovery dashboard</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 h-11 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                      disabled={isSubmitting}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                      <p id="email-error" role="alert" className="text-red-600 text-sm">
                        {errors.email.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                     Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-12 h-11 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                      disabled={isSubmitting}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
                      disabled={isSubmitting}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                      <p id="password-error" role="alert" className="text-red-600 text-sm">
                        {errors.password.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="remember" className="text-gray-700 cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-orange-600 hover:text-orange-700 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-1"
                    tabIndex={isSubmitting ? -1 : 0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 h-11 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid">
                <div className="flex flex-col gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  useOneTap
                />
              </div>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
        </div>
    </div>
  )
}

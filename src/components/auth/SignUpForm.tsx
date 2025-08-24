import React, { useCallback } from "react";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  AlertTriangle,
  Users,
  Package,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Lock,
  Shield,
  Info,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/api/auth"
import { useHandleToken } from "@/hooks/useHandleToken"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { useAuthStore } from "@/store/authStore";

// Define Zod schema for form validation
const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g., john@example.com)")
    .max(100, "Email address is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Password must contain at least one number (0-9)")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&*)"),
})

type SignUpFormInputs = z.infer<typeof signUpSchema>

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useHandleToken()
  useAuthRedirect()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  })

  const password = watch("password")
  const email = watch("email")
  const name = watch("name")

  // Enhanced password strength indicators
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
    special: /[^A-Za-z0-9]/.test(password || ""),
  }

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "text-red-500"
    if (passwordStrength <= 3) return "text-yellow-500"
    if (passwordStrength <= 4) return "text-blue-500"
    return "text-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Fair"
    if (passwordStrength <= 4) return "Good"
    return "Strong"
  }

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      await authService.register(data)
      toast.success(`Welcome to Disaster Recovery Platform, ${data.name}!`)
      navigate(`/login?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again."

      if (error?.message?.includes("email")) {
        errorMessage = "This email address is already registered. Please use a different email or try signing in."
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (error?.message?.includes("validation")) {
        errorMessage = "Please check your information and ensure all fields are filled correctly."
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

   const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed: No credential returned");
      return;
    }
    try {
      setIsGoogleLoading(true);
      const data = await authService.googleLogin({ 
        idToken: credentialResponse.credential 
      });
      //setUser(data.user.name || "User");

      toast.success("Google sign in successful!");
      // navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
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


      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Authentication options">
                <Link to="/login" className="flex-1">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                    role="tab"
                    aria-selected={activeTab === "login"}
                    aria-controls="login-panel"
                  >
                    Login
                  </button>
                </Link>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "signup"}
                  aria-controls="signup-panel"
                >
                  Sign Up
                </button>
              </div>
              
               <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-600">Join the disaster recovery community today</p>
              </div>

              <div className="grid  mb-6">
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
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-500">Or create account with email</span>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
                role="form"
                aria-label="Create account form"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={cn(
                        "h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors",
                        errors.name && "border-red-500 focus:border-red-500",
                        !errors.name && touchedFields.name && name && "border-green-500 focus:border-green-500",
                      )}
                      {...register("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error name-help" : "name-help"}
                      disabled={isSubmitting}
                    />
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                    {!errors.name && touchedFields.name && name && (
                      <CheckCircle2
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p id="name-help" className="text-xs text-gray-500">
                    Enter your first and last name as it appears on official documents
                  </p>
                  {errors.name && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
                      <p id="name-error" className="text-sm text-red-600" role="alert">
                        {errors.name.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={cn(
                        "h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors",
                        errors.email && "border-red-500 focus:border-red-500",
                        !errors.email && touchedFields.email && email && "border-green-500 focus:border-green-500",
                      )}
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error email-help" : "email-help"}
                      disabled={isSubmitting}
                    />
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                    {!errors.email && touchedFields.email && email && (
                      <CheckCircle2
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p id="email-help" className="text-xs text-gray-500">
                    We'll use this email to send you important account notifications
                  </p>
                  {errors.email && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
                      <p id="email-error" className="text-sm text-red-600" role="alert">
                        {errors.email.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={cn(
                        "h-11 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors",
                        errors.password && "border-red-500 focus:border-red-500",
                        !errors.password &&
                          password &&
                          passwordStrength >= 4 &&
                          "border-green-500 focus:border-green-500",
                      )}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password
                          ? "password-error password-requirements password-strength"
                          : "password-requirements password-strength"
                      }
                      disabled={isSubmitting}
                    />
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              passwordStrength <= 2 && "bg-red-500",
                              passwordStrength === 3 && "bg-yellow-500",
                              passwordStrength === 4 && "bg-blue-500",
                              passwordStrength === 5 && "bg-green-500",
                            )}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={cn("text-xs font-medium", getPasswordStrengthColor())} id="password-strength">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div id="password-requirements" className="space-y-1">
                    {errors.password && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <p id="password-error" className="text-sm text-red-600" role="alert">
                          {errors.password.message}
                        </p>
                      </div>
                    )}

                    {password && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2" aria-label="Password requirements checklist">
                        <div className="flex items-center gap-2 text-xs">
                          <Info className="w-3 h-3 text-gray-400" aria-hidden="true" />
                          <span className="text-gray-600">Password must contain:</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div
                            className={cn(
                              "flex items-center gap-2 transition-colors",
                              passwordChecks.length ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {passwordChecks.length ? (
                              <CheckCircle2 className="w-3 h-3" aria-label="Requirement met" />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                aria-label="Requirement not met"
                              />
                            )}
                            At least 8 characters
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-2 transition-colors",
                              passwordChecks.uppercase ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {passwordChecks.uppercase ? (
                              <CheckCircle2 className="w-3 h-3" aria-label="Requirement met" />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                aria-label="Requirement not met"
                              />
                            )}
                            One uppercase letter (A-Z)
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-2 transition-colors",
                              passwordChecks.lowercase ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {passwordChecks.lowercase ? (
                              <CheckCircle2 className="w-3 h-3" aria-label="Requirement met" />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                aria-label="Requirement not met"
                              />
                            )}
                            One lowercase letter (a-z)
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-2 transition-colors",
                              passwordChecks.number ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {passwordChecks.number ? (
                              <CheckCircle2 className="w-3 h-3" aria-label="Requirement met" />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                aria-label="Requirement not met"
                              />
                            )}
                            One number (0-9)
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-2 transition-colors",
                              passwordChecks.special ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {passwordChecks.special ? (
                              <CheckCircle2 className="w-3 h-3" aria-label="Requirement met" />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                aria-label="Requirement not met"
                              />
                            )}
                            One special character (!@#$%^&*)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  aria-describedby={isSubmitting ? "submit-loading" : undefined}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                      Create Account
                    </>
                  )}
                </Button>
                {isSubmitting && (
                  <p id="submit-loading" className="text-sm text-center text-gray-600" aria-live="polite">
                    Please wait while we securely create your account...
                  </p>
                )}

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
                  >
                    Sign in here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
       </div>
    </div>
  )
}

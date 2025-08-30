import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { LockKeyhole, Mail, Shield, AlertTriangle, MapPin, Heart } from "lucide-react"

const acceptSchema = z
    .object({
        token: z.string().min(1, "Token is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        email: z.string().email("Please enter a valid email address"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type AcceptFormData = z.infer<typeof acceptSchema>

export const AcceptDisasterAdminInviteForm = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AcceptFormData>({
        resolver: zodResolver(acceptSchema),
    })

    const password = watch("newPassword")

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const token = params.get("token")
        const email = params.get("email")

        if (!token || !email) {
            setTokenValid(false)
            toast.error("Invalid invite link", {
                description: "Missing required parameters in URL",
            })
            return
        }

        setValue("token", token)
        setValue("email", email)
    }, [location.search, setValue])

    const onSubmit = async (data: AcceptFormData) => {
        try {
            setIsSubmitting(true)
            console.log("Accepting disaster admin invite with data:", data)

            await authService.acceptDisasterAdminInvite({
                token: data.token,
                newPassword: data.newPassword,
                email: data.email,
            })

            toast.success("Admin account activated!", {
                description: "You can now access the disaster response dashboard",
            })

            navigate(`/login?email=${encodeURIComponent(data.email)}`);
        } catch (error: any) {
            toast.error("Failed to accept invite", {
                description: error.message || "Please try again later",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!tokenValid) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Invalid Invite Link
                        </CardTitle>
                        <CardDescription>
                            The admin invite link is missing required parameters.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md shadow-lg border-orange-200 dark:border-orange-800">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
                            <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                            Join Disaster Response Team
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Activate your admin account to coordinate emergency response
                            operations
                        </CardDescription>
                    </div>

                    {/* Features */}
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
                            <MapPin className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-800 dark:text-orange-300">Resource Map</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <Heart className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-800 dark:text-orange-300">Relief Operations</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    readOnly
                                    className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                    {...register("email")}
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                                New Password*
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter a strong password"
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                                    {...register("newPassword")}
                                    aria-invalid={!!errors.newPassword}
                                />
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.newPassword.message}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Password must be at least 8 characters with uppercase, lowercase,
                                number, and special character
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                                Confirm Password*
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                                    {...register("confirmPassword")}
                                    aria-invalid={!!errors.confirmPassword}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                            {password && password.length > 0 && !errors.confirmPassword && (
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    ✓ Password confirmation ready
                                </p>
                            )}
                        </div>

                        <input type="hidden" {...register("token")} />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5"
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
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Activating Account...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Activate Admin Account
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Secure access to emergency response operations and disaster management tools
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

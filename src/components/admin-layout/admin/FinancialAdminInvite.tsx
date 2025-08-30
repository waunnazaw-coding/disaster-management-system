"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const inviteSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    name: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export const FinancialAdminInviteForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
    });

    const onSubmit = async (data: InviteFormData) => {
        try {
            setIsSubmitting(true);
            const response = await authService.sendFinancialAdminInvite(data);

            toast.success("Admin invite sent successfully!", {
                description: `Invitation sent to ${response.email}`,
            });

            reset();
        } catch (error: any) {
            toast.error("Failed to send invite", {
                description: error.message || "Please try again later",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Send Financial Admin Invite</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            {...register("email")}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name (Optional)</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Admin Name"
                            {...register("name")}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Invite"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
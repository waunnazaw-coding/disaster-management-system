"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { Heart, User, Phone } from "lucide-react"
import { toast } from "sonner"

const helpTypes = ["Food", "Water", "Shelter", "Medical", "Clothing", "Transportation", "Other"]
const priorities = ["Low", "Medium", "High", "Critical"]

const formSchema = z.object({
  helpType: z.string().min(1, "Please select help type"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  priority: z.string().min(1, "Please select priority level"),
  peopleAffected: z.string().min(1, "Please specify number of people affected"),
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactPhone: z.string().min(8, "Please provide a valid phone number"),
  location: z.string().min(5, "Please provide detailed location"),
  urgency: z.string().optional(),
})

interface RequestHelpFormProps {
  eventId: string
  onSuccess: () => void
}

export function RequestHelpForm({ eventId, onSuccess }: RequestHelpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: formErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      helpType: "",
      description: "",
      priority: "",
      peopleAffected: "",
      contactName: "",
      contactPhone: "",
      location: "",
      urgency: "",
    },
  })

  const watchedValues = watch()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Help Request Submitted", {
        description: "Your help request has been submitted and will be reviewed by our admin team.",
      })

      reset()
      onSuccess()
    } catch (error) {
      toast.error("Submission Failed", {
        description: "There was an error submitting your request. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Help Type */}
     <div className="space-y-2 w-full"> {/* Ensure parent is full width */}
  <Label htmlFor="priority" className="font-semibold">
    Priority Level
  </Label>
  <Select onValueChange={(value) => setValue("priority", value)} value={watchedValues.priority}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select priority" />
    </SelectTrigger>
    <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)]">
      {priorities.map((priority) => (
        <SelectItem key={priority} value={priority}>
          {priority}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-semibold">
          Detailed Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe exactly what help you need, quantities, specific requirements..."
          className="min-h-24"
          {...register("description")}
        />
        <p className="text-sm text-muted-foreground">
          Be as specific as possible to help organizations respond effectively
        </p>
        {formErrors.description && <p className="text-sm text-red-600">{formErrors.description.message}</p>}
      </div>
 
      {/* Priority and People Affected */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
        <Label htmlFor="helpType" className="font-semibold flex items-center">
          <Heart className="mr-2 h-4 w-4 text-red-500" />
          Type of Help Needed
        </Label>
        <Select onValueChange={(value) => setValue("helpType", value)} value={watchedValues.helpType}>
          <SelectTrigger className="w-full">  {/* Added w-full here */}
            <SelectValue placeholder="Select type of help needed" />
          </SelectTrigger>
          <SelectContent className="w-full">  {/* Added w-full here */}
            {helpTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.helpType && <p className="text-sm text-red-600">{formErrors.helpType.message}</p>}
      </div>


        <div className="space-y-2">
          <Label htmlFor="peopleAffected" className="font-semibold">
            People Affected
          </Label>
          <Input id="peopleAffected" placeholder="e.g., 5 families, 20 people" {...register("peopleAffected")} />
          {formErrors.peopleAffected && <p className="text-sm text-red-600">{formErrors.peopleAffected.message}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName" className="font-semibold flex items-center">
            <User className="mr-2 h-4 w-4 text-blue-500" />
            Your Name
          </Label>
          <Input id="contactName" placeholder="Enter your full name" {...register("contactName")} />
          {formErrors.contactName && <p className="text-sm text-red-600">{formErrors.contactName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="font-semibold flex items-center">
            <Phone className="mr-2 h-4 w-4 text-green-500" />
            Phone Number
          </Label>
          <Input id="contactPhone" placeholder="+95 9 XXX XXX XXX" {...register("contactPhone")} />
          {formErrors.contactPhone && <p className="text-sm text-red-600">{formErrors.contactPhone.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="font-semibold">
          Specific Location
        </Label>
        <Input id="location" placeholder="Detailed address or landmark" {...register("location")} />
        <p className="text-sm text-muted-foreground">Provide exact location for delivery/pickup</p>
        {formErrors.location && <p className="text-sm text-red-600">{formErrors.location.message}</p>}
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="urgency" className="font-semibold">
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="urgency"
          placeholder="Any additional information, special circumstances, or urgency details..."
          className="min-h-20"
          {...register("urgency")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting Request..." : "Submit Help Request"}
      </Button>
    </form>
  )
}
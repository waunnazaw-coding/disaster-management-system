
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreateReliefTeamActivityDTO, 
  UpdateReliefTeamActivityDTO,
  ACTIVITY_TYPES,
  ReliefTeamActivityDTO
} from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useReliefTeams } from '@/hooks/useReliefTeams';
import { FileUploader } from './FileUploader';
import { ActivityMediaPreview } from './ActivityMediaPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fixed schema - simplified expenseAmount
const activitySchema = z.object({
  reliefTeamId: z.number().min(1, "Relief team is required"),
  activityDate: z.date(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  detailedAddress: z.string().optional(),
  activityType: z.string().min(1, "Activity type is required"),
 
});

// Extract form type from schema
type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  initialData?: ReliefTeamActivityDTO;
  onSubmit: (data: CreateReliefTeamActivityDTO | UpdateReliefTeamActivityDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [mediaToDelete, setMediaToDelete] = useState<number[]>([]);
  const { reliefTeams, loading: teamsLoading } = useReliefTeams();

  // Safely handle activity types with fallback
  const validActivityTypes = ACTIVITY_TYPES && ACTIVITY_TYPES.length > 0 
    ? ACTIVITY_TYPES.filter(type => type && type.trim() !== '') 
    : ['Training', 'Distribution', 'Medical', 'Shelter'];

  // Initialize form with proper defaults
  const defaultValues: Partial<ActivityFormValues> = {
    reliefTeamId: initialData?.reliefTeamId || (reliefTeams[0]?.id || 0),
    activityDate: initialData?.activityDate ? new Date(initialData.activityDate) : new Date(),
    title: initialData?.title || '',
    description: initialData?.description || '',
    detailedAddress: initialData?.detailedAddress || '',
    activityType: initialData?.activityType || validActivityTypes[0] || '',
   
  };

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues,
  });

  useEffect(() => {
    if (!teamsLoading && reliefTeams.length > 0) {
      if (!form.getValues('reliefTeamId') || form.getValues('reliefTeamId') === 0) {
        form.setValue('reliefTeamId', reliefTeams[0].id);
      }
    }
  }, [teamsLoading, reliefTeams, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        activityDate: new Date(initialData.activityDate)
      });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  const handleSubmit = (values: ActivityFormValues) => {
    const formData: any = {
      ...values,
    };

    if (initialData) {
      formData.id = initialData.id;
      formData.mediaIdsToDelete = mediaToDelete;
      formData.newMediaFiles = files;
    } else {
      formData.mediaFiles = files;
    }

    onSubmit(formData);
  };

  const handleRemoveMedia = (mediaId: number) => {
    setMediaToDelete([...mediaToDelete, mediaId]);
  };

  // Helper function to handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    if (value === '') {
      field.onChange(undefined);
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        field.onChange(num);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {initialData ? 'Edit Activity' : 'Create New Activity'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {initialData 
              ? 'Update your relief team activity details' 
              : 'Add a new activity for your relief team'}
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Core Information Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Core Information
                </h3>
                
                <div className="space-y-6">
                  {/* Relief Team - Full Width */}
                  <FormField
                    control={form.control}
                    name="reliefTeamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium block mb-2">
                          Relief Team *
                        </FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))} 
                          value={field.value.toString()}
                          disabled={teamsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue placeholder="Select relief team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading teams...
                              </SelectItem>
                            ) : reliefTeams.length > 0 ? (
                              reliefTeams.map((team) => (
                                <SelectItem 
                                  key={team.id} 
                                  value={team.id.toString()}
                                  className="py-3"
                                >
                                  {team.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-teams" disabled>
                                No teams available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Activity Type - Full Width */}
                  <FormField
                    control={form.control}
                    name="activityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium block mb-2">
                          Activity Type *
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue placeholder="Select activity type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {validActivityTypes.map((type) => (
                              <SelectItem key={type} value={type} className="py-3">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Activity Date */}
                    <FormField
                      control={form.control}
                      name="activityDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-gray-700 font-medium block mb-2">
                            Activity Date *
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-12 pl-3 text-left font-normal w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium block mb-2">
                            Title *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Activity title" 
                              className="h-12"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium block mb-2">
                          Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the activity" 
                            className="min-h-[150px] text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />

                   {/* Detailed Address */}
                  <FormField
                    control={form.control}
                    name="detailedAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium block mb-2">
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Detailed address (optional)" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              {/* <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  */}

                  {/* Expense Amount (Optional) */}
                  {/* <FormField
                    control={form.control}
                    name="expenseAmount"
                    render={({ field }) => {
                      // Convert undefined to empty string for input value
                      const value = field.value === undefined ? '' : field.value;
                      return (
                        <FormItem>
                          <div className="flex justify-between items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">
                              Expense Amount
                            </FormLabel>
                            <span className="text-sm text-gray-500">Optional</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="h-12 pl-8"
                              value={value}
                              onChange={(e) => handleNumberChange(e, field)}
                            />
                          </div>
                          <FormMessage className="mt-1" />
                        </FormItem>
                      );
                    }}
                  /> */}
                {/* </div>
              </div> */}

              {/* Media Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Media
                </h3>
                
                <div className="space-y-4">
                  {initialData && initialData.media && (
                    <ActivityMediaPreview 
                      media={initialData.media.filter(m => !mediaToDelete.includes(m.id))} 
                      onRemove={handleRemoveMedia}
                    />
                  )}
                  
                  <FileUploader 
                    files={files} 
                    setFiles={setFiles} 
                    maxFiles={5} 
                    maxSize={10 * 1024 * 1024}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="h-11 px-6 border border-gray-300 hover:bg-gray-100"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-8 bg-gray-800 hover:bg-gray-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {initialData ? 'Update Activity' : 'Create Activity'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
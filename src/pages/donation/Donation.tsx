import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Heart,
  Shield,
  Users,
  Truck,
  Home,
  BookOpen,
  DollarSign,
  Smartphone,
  User,
  Building2,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DonationDto,
  donationService,
  type CreateDonationDto,
} from "../../api/donationService";
import FinancialTransparency from "./FinancialTransparency";
import { useAuthStore } from "@/store/authStore";
import QRCode from "@/images/qrcode.png"

function formatRelativeTime(date?: string): string {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} years ago`;
}

const donationCategories = [
  {
    title: "Emergency Response",
    description: "Support immediate disaster response and rescue operations",
    icon: <Shield className="h-8 w-8" />,
    color: "bg-red-100 text-red-800",
    goal: 50000,
    raised: 32000,
    supporters: 245,
  },
  {
    title: "Community Training",
    description: "Fund disaster preparedness training programs",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-blue-100 text-blue-800",
    goal: 25000,
    raised: 18500,
    supporters: 156,
  },
  {
    title: "Relief Supplies",
    description: "Provide essential supplies to disaster-affected families",
    icon: <Truck className="h-8 w-8" />,
    color: "bg-green-100 text-green-800",
    goal: 75000,
    raised: 45000,
    supporters: 389,
  },
  {
    title: "Shelter Support",
    description: "Help rebuild homes and temporary shelters",
    icon: <Home className="h-8 w-8" />,
    color: "bg-purple-100 text-purple-800",
    goal: 100000,
    raised: 67000,
    supporters: 423,
  },
];

const donationAmounts = [
  { amount: 5000, description: "Provides emergency supplies for 1 family" },
  { amount: 15000, description: "Funds training for 10 community volunteers" },
  { amount: 30000, description: "Supports emergency response for 1 week" },
  { amount: 50000, description: "Helps rebuild 1 family home" },
];

const sourceTypes = [
  {
    value: "Personal",
    label: "Personal",
    icon: <User className="h-4 w-4" />,
    description: "Individual donation",
  },
  {
    value: "Organization",
    label: "Organization",
    icon: <Building2 className="h-4 w-4" />,
    description: "Non-profit organization",
  },
  {
    value: "NGO",
    label: "NGO",
    icon: <FileText className="h-4 w-4" />,
    description: "Non-governmental org",
  },
  {
    value: "Company",
    label: "Company",
    icon: <Building2 className="h-4 w-4" />,
    description: "Corporate donation",
  },
  {
    value: "Anonymous",
    label: "Anonymous",
    icon: <User className="h-4 w-4" />,
    description: "Anonymous donor",
  },
];

const paymentMethods = [
  {
    id: "kpay",
    name: "Kpay",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Kpay Mobile Banking",
    popular: true,
    accountName: "DisasterGuard MM",
    phoneNumber: "+95 9 123 456 789",
    qrCodeUrl: QRCode,
  },
  {
    id: "wavepay",
    name: "Wave Pay",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Wave Pay Mobile Banking",
    accountName: "DisasterGuard MM",
    phoneNumber: "+95 9 987 654 321",
    qrCodeUrl: QRCode
  },
  {
    id: "ayapay",
    name: "Aya Pay",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Aya Pay Mobile Banking",
    accountName: "DisasterGuard MM",
    phoneNumber: "+95 9 555 444 333",
    qrCodeUrl: QRCode
  },
  {
    id: "uabpay",
    name: "UAB Pay",
    icon: <Smartphone className="h-6 w-6" />,
    description: "UAB Pay Mobile Banking",
    accountName: "DisasterGuard MM",
    phoneNumber: "+95 9 222 333 444",
    qrCodeUrl: QRCode
  },
];

// Zod schema to validate the form fields
const donationSchema = z.object({
  donorName: z.string().min(1, "Donor name is required"),
  donorPhone: z.string().min(1, "Phone number is required"),
  sourceType: z.enum(
    sourceTypes.map((st) => st.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a source type" }),
    }
  ),
  description: z.string().optional(),
  selectedCategory: z.number().min(0, "Please select a category"),
  selectedAmount: z.number().min(1, "Please select or enter a donation amount"),
  selectedPaymentMethod: z.string().min(1, "Please select a payment method"),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DonationPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: "",
      donorPhone: "",
      sourceType: "",
      description: "",
      selectedCategory: undefined,
      selectedAmount: undefined,
      selectedPaymentMethod: "",
    },
  });

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const handleCategoryClick = (index: number) => {
    const newValue = index === selectedCategory ? null : index;
    setSelectedCategory(newValue);
    setValue("selectedCategory", newValue === null ? undefined : newValue, {
      shouldValidate: true,
    });
  };
  const handleAmountClick = (amount: number) => {
    const newValue = amount === selectedAmount ? null : amount;
    setSelectedAmount(newValue);
    setValue("selectedAmount", newValue === null ? undefined : newValue, {
      shouldValidate: true,
    });
  };
  const handlePaymentMethodClick = (methodId: string) => {
    const newValue = methodId === selectedPaymentMethod ? null : methodId;
    setSelectedPaymentMethod(newValue);
    setValue("selectedPaymentMethod", newValue ?? "", { shouldValidate: true });
  };
  const onCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    setSelectedAmount(null);
    setValue("selectedAmount", val, { shouldValidate: true });
  };

  const { isAuthenticated } = useAuthStore();

  const onSubmit = async (data: DonationFormData) => {
    // Check if user is logged in using your auth store
    if (!isAuthenticated) {
      toast.error("Please log in first to make a donation");
      //navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const donationData: CreateDonationDto = {
        name: data.donorName,
        donorPhoneNumber: data.donorPhone,
        sourceType: data.sourceType,
        description: data.description,
        category: donationCategories[data.selectedCategory!]?.title,
        amount: data.selectedAmount!,
        currency: "MMK",
        paymentMethod: data.selectedPaymentMethod,
      };
      await donationService.createDonation(donationData);
      toast.success(
        "Donation submitted successfully! Thank you for your generosity."
      );
      navigate("/profile?tab=donations");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit donation");
    } finally {
      setLoading(false);
    }
  };
  //for donation statistics
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPeople, setTotalPeople] = useState<number>(0);
  const [recentDonations, setRecentDonations] = useState<DonationDto[]>([]);
  useEffect(() => {
    donationService
      .getTotalAmountNowYear()
      .then((amount) => setTotalAmount(amount))
      .then(() => console.log(totalAmount))
      .catch((err) => {
        console.error("Error loading total amount last year:", err);
      });
    donationService
      .getTotalPeopleByPhone()
      .then((amount) => setTotalPeople(amount))
      .then(() => console.log(totalPeople))
      .catch((err) => {
        console.error("Error loading total amount last year:", err);
      });
    donationService
      .getRecentDonations()
      .then((data) => setRecentDonations(data))
      .catch((err) => {
        console.error("Error fetching recent donations:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your donation helps us protect communities across Myanmar. Every
            contribution, no matter the size, makes a real difference in saving
            lives and building resilience.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">
                MMK {totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Total Raised This Year
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,200+
              </div>
              <div className="text-sm text-gray-600">Families Helped</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalPeople.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Active Donors</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Goes to Programs</div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-600" />
                    Make a Donation
                  </CardTitle>
                  <CardDescription>
                    Choose your donation amount and help us continue our vital
                    work.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Categories */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Choose a Category
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {donationCategories.map((category, index) => {
                        const selected = selectedCategory === index;
                        return (
                          <Card
                            key={index}
                            className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selected
                              ? "border-red-500 bg-red-50 shadow-md"
                              : "border-gray-200 hover:border-red-300"
                              }`}
                            onClick={() => handleCategoryClick(index)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-2 rounded-lg ${category.color
                                    .replace("text-", "bg-")
                                    .replace("-800", "-100")}`}
                                >
                                  {category.icon}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    {category.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {category.description}
                                  </p>
                                  {selected && (
                                    <div className="text-xs text-green-600 font-medium">
                                      ✓ Selected
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {errors.selectedCategory && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.selectedCategory.message}
                      </p>
                    )}
                  </div>

                  {/* Donation Amounts */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Select Amount (MMK)
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {donationAmounts.map((donation, index) => {
                        const selected = selectedAmount === donation.amount;
                        return (
                          <Card
                            key={index}
                            className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selected
                              ? "border-red-500 bg-red-50 shadow-md"
                              : "border-gray-200 hover:border-red-300"
                              }`}
                            onClick={() => handleAmountClick(donation.amount)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-xl font-bold text-red-600 mb-1">
                                MMK {donation.amount.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {donation.description}
                              </div>
                              {selected && (
                                <div className="text-xs text-green-600 font-medium mt-2">
                                  ✓ Selected
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <Input
                        id="customAmount"
                        placeholder="Enter custom amount in MMK"
                        type="number"
                        onChange={onCustomAmountChange}
                        min={0}
                        step={1000}
                      />
                      {errors.selectedAmount && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.selectedAmount.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Payment Method
                    </Label>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const selected = selectedPaymentMethod === method.id;
                        return (
                          <Card
                            key={method.id}
                            className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selected
                              ? "border-red-500 bg-red-50 shadow-md"
                              : "border-gray-200 hover:border-red-300"
                              }`}
                            onClick={() => handlePaymentMethodClick(method.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {method.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">
                                      {method.name}
                                    </span>
                                    {method.popular && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Popular
                                      </Badge>
                                    )}
                                    {selected && (
                                      <Badge className="text-xs bg-green-100 text-green-800">
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {method.description}
                                  </p>

                                  {/* Account Information - Only show when selected */}
                                  {selected && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                        <div className="space-y-2">
                                          <h4 className="font-semibold text-gray-900 text-sm">
                                            Account Details
                                          </h4>
                                          <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                              Account Name:
                                            </span>{" "}
                                            {method.accountName}
                                          </p>
                                          <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                              Phone Number:
                                            </span>{" "}
                                            {method.phoneNumber}
                                          </p>
                                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                                            <p className="text-xs text-yellow-800">
                                              💡 Please include your name in the
                                              transfer description for proper
                                              receipt processing.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <img
                                            src={method.qrCodeUrl}
                                            alt={`${method.name} QR Code`}
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                                          />
                                          <p className="text-xs text-gray-500 mt-2 text-center">
                                            Scan QR code to pay
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {!selected && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Click to view account details
                                    </p>
                                  )}
                                  {errors.selectedPaymentMethod && selected && (
                                    <p className="text-xs text-red-600 mt-1">
                                      {errors.selectedPaymentMethod.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {errors.selectedPaymentMethod && !selectedPaymentMethod && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.selectedPaymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="sourceType"
                        className="text-base font-semibold text-gray-900"
                      >
                        Source Type *
                      </Label>
                      <Controller
                        control={control}
                        name="sourceType"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue=""
                          >
                            <SelectTrigger className="h-12 text-base w-full">
                              <SelectValue placeholder="Select source type" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              {sourceTypes.map((source) => (
                                <SelectItem
                                  key={source.value}
                                  value={source.value}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                      {source.icon}
                                    </div>
                                    <div>
                                      <div>{source.label}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sourceType && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.sourceType.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donorName">Donor Name</Label>
                      <Input
                        id="donorName"
                        placeholder="Enter your name"
                        {...register("donorName")}
                        aria-invalid={errors.donorName ? "true" : "false"}
                      />
                      {errors.donorName && (
                        <p role="alert" className="text-xs text-red-600 mt-1">
                          {errors.donorName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2">
                      <Label htmlFor="donorPhone">Phone Number</Label>
                      <Input
                        id="donorPhone"
                        placeholder="Enter your phone number"
                        {...register("donorPhone")}
                        aria-invalid={errors.donorPhone ? "true" : "false"}
                      />
                      {errors.donorPhone && (
                        <p role="alert" className="text-xs text-red-600 mt-1">
                          {errors.donorPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Enter your description"
                        {...register("description")}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with recent donations and contact info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Donations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentDonations.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No recent donations yet.
                    </div>
                  ) : (
                    recentDonations.slice(0, 5).map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center gap-3"
                      >
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {donation.donorName || donation.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-600">
                            MMK {donation.amount?.toLocaleString()} •{" "}
                            {formatRelativeTime(donation.dateReceived)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions about donating? Our team is here to help.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      donation@disasterguard.mm
                    </p>
                    <p className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      +95 1 234 5683
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* How Your Money Helps Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Your Money Helps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">MMK 5,000</h3>
                <p className="text-sm text-gray-600">
                  Emergency supplies for one family for one week
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">MMK 15,000</h3>
                <p className="text-sm text-gray-600">
                  Training materials for 10 community volunteers
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">MMK 30,000</h3>
                <p className="text-sm text-gray-600">
                  Relief supplies delivery to remote areas
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">MMK 50,000</h3>
                <p className="text-sm text-gray-600">
                  Temporary shelter for displaced families
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Section */}
        <FinancialTransparency />
      </div>
    </div>
  );
}

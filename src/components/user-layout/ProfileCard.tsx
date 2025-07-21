"use client"

import { Edit, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { authService } from "../../api/auth"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"

// Define types that match your API response
type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  profile: string | null;
  createdAt: string | null;
};

// Frontend user type with additional UI-specific fields
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  profile: string | null;
};

interface ProfileCardProps {
  onEditProfile: () => void;
}

export default function ProfileCard({ onEditProfile }: ProfileCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the API response
        const apiResponse = await authService.getCurrentUser();
        
        // Check if the request was successful
        if (!apiResponse.isSuccess || !apiResponse.data) {
          throw new Error(apiResponse.message || "No user data received");
        }

        // Transform API response to match our frontend User type
        const transformedUser: User = {
          id: apiResponse.data.id,
          name: apiResponse.data.name,
          email: apiResponse.data.email,
          phone: "", // Default value since not in API
          role: "User", // Default value
          status: "Active", // Default value
          createdAt: apiResponse.data.createdAt || new Date().toISOString(),
          profile: apiResponse.data.profile
        };

        setUser(transformedUser);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load user profile";
        setError(errorMessage);
        toast.error("Could not load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getStatusColor = (status: string = "Active") => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string = "User") => {
    const colors = {
      User: "bg-blue-100 text-blue-800",
      Admin: "bg-purple-100 text-purple-800",
      ReliefTeam: "bg-orange-100 text-orange-800",
      Org: "bg-teal-100 text-teal-800",
      SysAdmin: "bg-red-100 text-red-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-36" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center text-red-500">
          {error || "User data not available"}
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            {user.profile ? (
              <img 
                src={user.profile} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(user.name)}
              </div>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 shadow-md"
              onClick={onEditProfile}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <Button onClick={onEditProfile} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {user.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
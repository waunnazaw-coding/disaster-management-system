import { useEffect, useState } from "react";
import { 
  AlertCircle, 
  CheckCircle, 
  ClipboardList, 
  Clock,
  Users,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Package,
  Heart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReliefStore } from "@/store/reliefStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Define types for our dashboard data
interface DashboardStats {
  openRequests: number;
  completedTasks: number;
  totalTasks: number;
  highPriority: number;
  teamMembers: number;
  activeAreas: number;
}

interface RecentActivity {
  id: number;
  requestId: number;
  action: string;
  team: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReliefDashboard = () => {
  const { 
    assignments, 
    loading, 
    reliefTeamId, 
    fetchTeamAssignments,
    currentUser 
  } = useReliefStore();
  const [stats, setStats] = useState<DashboardStats>({
    openRequests: 0,
    completedTasks: 0,
    totalTasks: 0,
    highPriority: 0,
    teamMembers: 0,
    activeAreas: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Process data for charts
  const statusData = [
    { name: 'Assigned', value: assignments.filter(a => a.status === 'Assigned').length },
    { name: 'In Progress', value: assignments.filter(a => a.status === 'InProgress').length },
    { name: 'Completed', value: assignments.filter(a => a.status === 'Done').length },
    { name: 'Cancelled', value: assignments.filter(a => a.status === 'Cancelled').length },
  ];

  const priorityData = [
    { 
      name: 'Critical', 
      value: assignments.filter(a => a.requestDetails?.priority === 'Critical').length 
    },
    { 
      name: 'High', 
      value: assignments.filter(a => a.requestDetails?.priority === 'High').length 
    },
    { 
      name: 'Medium', 
      value: assignments.filter(a => a.requestDetails?.priority === 'Medium').length 
    },
    { 
      name: 'Low', 
      value: assignments.filter(a => a.requestDetails?.priority === 'Low').length 
    },
  ];

  // Calculate support type distribution
  const supportTypeData = assignments.reduce((acc, assignment) => {
    const supportType = assignment.requestDetails?.supportType || 'Unknown';
    const existing = acc.find(item => item.name === supportType);
    
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: supportType, value: 1 });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    await fetchTeamAssignments();
    
    // Calculate stats from assignments
    const completedTasks = assignments.filter(a => a.status === 'Done').length;
    const openRequests = assignments.filter(a => 
      a.status === 'Assigned' || a.status === 'InProgress'
    ).length;
    const highPriority = assignments.filter(a => 
      a.requestDetails?.priority === 'High' || a.requestDetails?.priority === 'Critical'
    ).length;
    
    // Extract unique locations from assignments
    const uniqueLocations = new Set(
      assignments
        .map(a => a.requestDetails?.detailedAddress?.split(',')[0])
        .filter(Boolean)
    ).size;
    
    setStats({
      openRequests,
      completedTasks,
      totalTasks: assignments.length,
      highPriority,
      teamMembers: 12, // This would come from your team API
      activeAreas: uniqueLocations
    });

    // Generate recent activities from assignments
    const activities = assignments
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
      .slice(0, 5)
      .map(assignment => ({
        id: assignment.id,
        requestId: assignment.assistanceRequestId,
        action: `Request #${assignment.assistanceRequestId} assigned`,
        team: assignment.reliefTeamName || 'Your Team',
        timestamp: formatRelativeTime(assignment.assignedAt),
        status: getActivityStatus(assignment.status)
      }));
    
    setRecentActivities(activities);
    setIsRefreshing(false);
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityStatus = (status: string): 'completed' | 'in-progress' | 'pending' => {
    switch (status) {
      case 'Done': return 'completed';
      case 'InProgress': return 'in-progress';
      default: return 'pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'InProgress': return 'bg-amber-100 text-amber-800';
      case 'Done': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-amber-600';
      case 'pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'Medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Low': return <ClipboardList className="h-4 w-4 text-blue-500" />;
      default: return <ClipboardList className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome back, {currentUser?.name || 'Team Member'}!
          </h2>
          <p className="text-gray-600 mt-2">
            {reliefTeamId ? `Team ID: ${reliefTeamId} • ` : ''}
            Here's what's happening with your relief efforts today.
          </p>
        </div>
        {/* <Button 
          onClick={loadData} 
          disabled={isRefreshing}
          variant="outline" 
          className="mt-4 md:mt-0"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRequests}</div>
            <p className="text-xs text-muted-foreground">
              Needs immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTasks > 0 
                ? `+${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% from total`
                : 'No tasks yet'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All assigned tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              Critical & High priority requests
            </p>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active responders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAreas}</div>
            <p className="text-xs text-muted-foreground">
              Locations with ongoing operations
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Breakdown of all requests by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {statusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No assignment data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Priority Levels</CardTitle>
            <CardDescription>Distribution of requests by priority</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {priorityData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData.filter(item => item.value > 0)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No priority data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Support Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest assignments and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getActivityStatusColor(activity.status)}`}>
                      {activity.status === 'completed' && <CheckCircle className="h-5 w-5" />}
                      {activity.status === 'in-progress' && <Clock className="h-5 w-5" />}
                      {activity.status === 'pending' && <AlertCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.team} • {activity.timestamp}
                      </p>
                    </div>
                    <Badge variant="outline" className={getActivityStatusColor(activity.status)}>
                      {activity.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent activities
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Type Distribution</CardTitle>
            <CardDescription>Types of assistance being provided</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {supportTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supportTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {supportTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No support type data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High Priority Requests */}
      {stats.highPriority > 0 && (
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              High Priority Requests
            </CardTitle>
            <CardDescription className="text-amber-700">
              These requests require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments
                .filter(a => a.requestDetails?.priority === 'High' || a.requestDetails?.priority === 'Critical')
                .slice(0, 3)
                .map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(assignment.requestDetails?.priority || '')}
                      <div>
                        <p className="font-medium">Request #{assignment.assistanceRequestId}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.requestDetails?.supportType} • {assignment.requestDetails?.detailedAddress?.split(',')[0]}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReliefDashboard;
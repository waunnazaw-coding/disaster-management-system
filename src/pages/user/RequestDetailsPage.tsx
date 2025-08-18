// src/pages/RequestDetailsPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssistanceRequestsStore } from '@/store/assistanceRequestStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Mail, Phone, MapPin, ClipboardList, Users } from 'lucide-react';
import { RequestPriorityBadge } from '@/components/assistance_requests/RequestPriorityBadge';
import { RequestStatusBadge } from '@/components/assistance_requests/RequestStatusBadge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRequest, fetchRequestById, loading } = useAssistanceRequestsStore();
  
  useEffect(() => {
    if (id) {
      fetchRequestById(parseInt(id));
    }
  }, [id, fetchRequestById]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="h-8 w-8 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The assistance request you're looking for doesn't exist or may have been removed.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assistance Request <span className="text-blue-600">#{currentRequest.id}</span>
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Details Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <span>Request Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Disaster
                </div>
                <div className="text-sm">
                  {currentRequest.disasterEventName || 'Not specified'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Support Type
                </div>
                <div className="text-sm font-medium">
                  {currentRequest.supportType}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Quantity
                </div>
                <div className="text-sm">
                  {currentRequest.quantity} {currentRequest.unit}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Priority
                </div>
                <div>
                  <RequestPriorityBadge priority={currentRequest.priority as any} />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </div>
                <div>
                  <RequestStatusBadge status={currentRequest.status as any} />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </div>
                <div className="text-sm">
                  {currentRequest.description || 'No description provided'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </div>
                <div className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(currentRequest.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {currentRequest.updatedAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </div>
                  <div className="text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(currentRequest.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {currentRequest.fulfilledAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fulfilled At
                  </div>
                  <div className="text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-500" />
                    {new Date(currentRequest.fulfilledAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Information Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Name
                </div>
                <div className="text-sm flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  {currentRequest.contactName || 'Not specified'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </div>
                <div className="text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {currentRequest.email || 'Not specified'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </div>
                <div className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {currentRequest.contactPhone || 'Not specified'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Address
                </div>
                <div className="text-sm flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  {currentRequest.detailedAddress || 'Not specified'}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Requester
                </div>
                <div className="text-sm">
                  {currentRequest.userName || 'Unknown user'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Assignments Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Assigned Teams</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentRequest.assignments.length > 0 ? (
            <div className="space-y-4">
              {currentRequest.assignments.map(assignment => (
                <div key={assignment.id} className="border rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center">
                        {assignment.reliefTeamName}
                        <Badge variant="secondary" className="ml-3">
                          Team ID: {assignment.reliefTeamId}
                        </Badge>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Assigned by: {assignment.assignedByName}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'Assigned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                        assignment.status === 'InProgress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                        assignment.status === 'Done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {assignment.status}
                      </div>
                      
                      <div>
                        <RequestPriorityBadge priority={assignment.priority} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">Assigned At</p>
                        <p>{new Date(assignment.assignedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {assignment.completedAt && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Completed At</p>
                          <p>{new Date(assignment.completedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {assignment.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-medium flex items-center">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Team Notes
                      </p>
                      <p className="mt-2 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-line">
                        {assignment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No Teams Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This request hasn't been assigned to any relief teams yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
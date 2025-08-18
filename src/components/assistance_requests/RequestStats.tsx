// components/assistance_requests/RequestStats.tsx
"use client"

import { Gift, Check, X, RefreshCw, Clock, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface RequestStatsProps {
  totalCount: number
  pendingCount: number
  approvedCount: number
   inProgressCount: number
  fulfilledCount: number
  rejectedCount: number
}

export default function RequestStats({
  totalCount,
  pendingCount,
  approvedCount,
   inProgressCount,
  fulfilledCount,
  rejectedCount,
}: RequestStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
            <Gift className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Approved</p>
              <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
            </div>
            <Check className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{inProgressCount}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Fulfilled</p>
              <p className="text-2xl font-bold text-green-600">{fulfilledCount}</p>
            </div>
            <Check className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <X className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
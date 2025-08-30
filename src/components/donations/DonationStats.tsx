"use client"

import { Gift, Check, X, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import MoneyDonationChart from "./DonationChart"

interface DonationStatsProps {
  totalCount: number
  pendingCount: number
  verifiedCount: number
  distributedCount: number
  cancelledCount: number
}

export default function DonationStats({
  totalCount,
  pendingCount,
  verifiedCount,
  distributedCount,
  cancelledCount,
}: DonationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <RefreshCw className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Verified</p>
              <p className="text-2xl font-bold text-blue-600">{verifiedCount}</p>
            </div>
            <Check className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      {/* <Card className="bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Distributed</p>
              <p className="text-2xl font-bold text-green-600">{distributedCount}</p>
            </div>
            <Check className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card> */}
      <Card className="bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
            </div>
            <X className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
      {/* <MoneyDonationChart /> */}
    </div>
  )
}

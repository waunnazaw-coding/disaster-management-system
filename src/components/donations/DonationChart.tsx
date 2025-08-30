"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { donationService } from "@/api/donationService"

interface ChartData {
  name: string
  amount: number
}

export default function MoneyDonationChart() {
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([])
  const [yearlyData, setYearlyData] = useState<ChartData[]>([])
  const [categoryData, setCategoryData] = useState<ChartData[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5)
  const [endYear, setEndYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("monthly")

  const fetchMonthlyData = async () => {
    try {
      setLoading(true)
      const data = await donationService.getMonthlyDonations(selectedYear)
      const formattedData = data.map(item => ({
        name: item.month,
        amount: item.amount
      }))
      setMonthlyData(formattedData)
    } catch (error) {
      console.error("Error fetching monthly data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchYearlyData = async () => {
    try {
      setLoading(true)
      const data = await donationService.getYearlyDonations(startYear, endYear)
      const formattedData = data.map(item => ({
        name: item.year.toString(),
        amount: item.amount
      }))
      setYearlyData(formattedData)
    } catch (error) {
      console.error("Error fetching yearly data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      const data = await donationService.getDonationsByCategory()
      const formattedData = data.map(item => ({
        name: item.category,
        amount: item.amount
      }))
      setCategoryData(formattedData)
    } catch (error) {
      console.error("Error fetching category data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "monthly") {
      fetchMonthlyData()
    } else if (activeTab === "yearly") {
      fetchYearlyData()
    } else if (activeTab === "category") {
      fetchCategoryData()
    }
  }, [activeTab, selectedYear, startYear, endYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const renderMonthlyChart = () => {
    if (loading) {
      return <Skeleton className="h-80 w-full" />
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
          />
          <Legend />
          <Bar dataKey="amount" name="Monthly Donations" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderYearlyChart = () => {
    if (loading) {
      return <Skeleton className="h-80 w-full" />
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={yearlyData} margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
          />
          <Legend />
          <Area type="monotone" dataKey="amount" name="Yearly Donations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  const renderCategoryChart = () => {
    if (loading) {
      return <Skeleton className="h-80 w-full" />
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
          />
          <Legend />
          <Bar dataKey="amount" name="Category Donations" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Donation Analytics</CardTitle>
            <CardDescription>Visualize donation trends over time</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex justify-end mb-4">
            {activeTab === "monthly" && (
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {activeTab === "yearly" && (
              <div className="flex gap-2">
                <Select value={startYear.toString()} onValueChange={(value) => setStartYear(parseInt(value))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={endYear.toString()} onValueChange={(value) => setEndYear(parseInt(value))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {activeTab === "monthly" && renderMonthlyChart()}
          {activeTab === "yearly" && renderYearlyChart()}
          {activeTab === "category" && renderCategoryChart()}
        </CardContent>
      </Card>
    </div>
  )
}
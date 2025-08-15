"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import type { AllocationTypeSummary } from "@/types/financial-allocations"

interface AllocationChartsProps {
  data: AllocationTypeSummary[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AllocationCharts({ data }: AllocationChartsProps) {
  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Allocation Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amount: {
                label: "Amount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ allocationTypeName, percentageOfYear }) =>
                    `${allocationTypeName}: ${percentageOfYear.toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalAmount"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation Amounts by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              totalAmount: {
                label: "Total Amount",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="allocationTypeName" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={formatCurrency} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                />
                <Bar dataKey="totalAmount" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</div>
              <div className="text-sm text-muted-foreground">Total Allocated</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{data.length}</div>
              <div className="text-sm text-muted-foreground">Allocation Types</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(Math.max(...data.map((d) => d.totalAmount)))}
              </div>
              <div className="text-sm text-muted-foreground">Highest Allocation</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalAmount / data.length)}</div>
              <div className="text-sm text-muted-foreground">Average Allocation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

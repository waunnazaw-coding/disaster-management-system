
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { AllocationsTable } from "@/components/financial-allocations/allocations-table"
import { AllocationForm } from "@/components/financial-allocations/allocation-form"
import { AllocationCharts } from "@/components/financial-allocations/allocation-charts"
import { ImportExport } from "@/components/financial-allocations/import-export"
import { useFinancialAllocationsStore } from "@/store/financial-allocations-store"
import toast, { Toaster } from "react-hot-toast"
import type {
  FinancialAllocationRequestDto,
  FinancialAllocationResponseDto,
} from "@/api/financialAllocationService"

export default function FinancialAllocationsPage() {
  const {
    allocationSummary,
    totalsOverview,
    allocations,
    selectedYear,
    activeTab,
    showForm,
    editingAllocation,
    isLoading,
    error,

    setSelectedYear,
    setActiveTab,
    setShowForm,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    setEditingAllocation,
    cancelForm,
    refreshData,
    loadAllocations,
    loadAllocationSummary,
    loadTotalsOverview,
    importExcelFile,      // <-- Import from store
    downloadPdfReport,    // <-- Export from store
  } = useFinancialAllocationsStore()

  const filteredAllocations = useFinancialAllocationsStore(state => state.filteredAllocations);

  console.log("Filtered allocations in component:", filteredAllocations);


  // Load all relevant data on selectedYear change
  useEffect(() => {
    loadAllocations(selectedYear)
    loadAllocationSummary(selectedYear)
    loadTotalsOverview(selectedYear)
  }, [selectedYear, loadAllocations, loadAllocationSummary, loadTotalsOverview])

  // Handlers for create, update, delete
  const handleCreateAllocation = async (data: FinancialAllocationRequestDto) => {
    try {
      await createAllocation(data)
      toast.success("Financial allocation has been successfully created.")
    } catch {
      toast.error("Failed to create allocation. Please try again.")
    }
  }

  const handleUpdateAllocation = async (data: FinancialAllocationRequestDto) => {
    try {
      await updateAllocation(data)
      toast.success("Financial allocation has been successfully updated.")
    } catch {
      toast.error("Failed to update allocation. Please try again.")
    }
  }

  const handleDeleteAllocation = async (id: number) => {
    try {
      await deleteAllocation(id)
      toast.success("Financial allocation has been successfully deleted.")
    } catch {
      toast.error("Failed to delete allocation. Please try again.")
    }
  }

  const handleEditAllocation = (allocation: FinancialAllocationResponseDto) => {
    setEditingAllocation(allocation)
    setShowForm(true)
  }

  const handleImportSuccess = async () => {
    await refreshData()
    toast.success("Allocation data has been refreshed after import.")
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  ).sort((a, b) => b.localeCompare(a));


  if (showForm) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="container mx-auto p-6">
          <div className="flex justify-center">
            <AllocationForm
              onSubmit={editingAllocation ? handleUpdateAllocation : handleCreateAllocation}
              onCancel={cancelForm}
              initialData={editingAllocation || undefined}
              isEditing={!!editingAllocation}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Allocations</h1>
            <p className="text-muted-foreground">Manage and track your financial allocations</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Allocation
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total Budget */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(totalsOverview?.totalDonations)
                )}
              </div>
              <p className="text-xs text-muted-foreground">Annual budget {selectedYear}</p>
            </CardContent>
          </Card>

          {/* Total Donations */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(totalsOverview?.totalDonations)
                )}
              </div>
              <p className="text-xs text-muted-foreground">Donations in {selectedYear}</p>
            </CardContent>
          </Card>

          {/* Total Allocations */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Allocations </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(totalsOverview?.totalAllocations)
                )}
              </div>
              <p className="text-xs text-muted-foreground">In {selectedYear}</p>
            </CardContent>
          </Card>

          {/* Total Allocation Count */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  totalsOverview?.totalAllocationsCount ?? 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">Allocations in {selectedYear}</p>
            </CardContent>
          </Card>

          {/* Difference */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Remainding Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(totalsOverview?.difference)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Donations - Allocations
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AllocationCharts data={allocationSummary} />
            <AllocationsTable
              allocations={allocations.slice(0, 5)}
              onEdit={handleEditAllocation}
              onDelete={handleDeleteAllocation}
            />
          </TabsContent>

          <TabsContent value="allocations">
            <AllocationsTable
              allocations={allocations}
              onEdit={handleEditAllocation}
              onDelete={handleDeleteAllocation}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AllocationCharts data={allocationSummary} />
          </TabsContent>

          <TabsContent value="import-export">
           <ImportExport
              selectedYear={selectedYear}
              importExcelFile={importExcelFile}
              downloadPdfReport={downloadPdfReport}
              onImportSuccess={handleImportSuccess}
            />

          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

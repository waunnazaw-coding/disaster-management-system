import api from "@/api/axioInstance";

export interface AllocationTypeSummary {
  allocationTypeName: string;
  totalAmount: number;
  percentageOfYear: number;
}

export interface FinancialAllocationRequestDto {
  // donationId?: number | null  (commented out as per your last template)
  allocationTypeName: string;
  amount: number;
  allocationDate: string; // ISO Date string
  notes?: string | null;
  detailName: string;
  detailDescription?: string | null;
}

export interface FinancialAllocationResponseDto extends FinancialAllocationRequestDto {
  allocationId: number; // changed from allocationId to id
  createdAt: string;
  updatedAt: string;
}

export interface Result<T> {
  isSuccess: boolean,
  data: T,
  message?: string,
  isError?: boolean,
  isNotFoundError?: boolean,
  isValidationError?: boolean,
  // other flags...
}

// Create financial allocation
export async function createFinancialAllocation(
  dto: FinancialAllocationRequestDto
): Promise<Result<FinancialAllocationResponseDto>> {
  const response = await api.post<Result<FinancialAllocationResponseDto>>(
    "/FinancialAllocations",
    dto
  );
  return response.data;
}

// Get annual report for startYear to endYear
export async function getAnnualReport(
  startYear: number,
  endYear: number
): Promise<Result<FinancialAllocationResponseDto[]>> {
  const response = await api.get<Result<FinancialAllocationResponseDto[]>>(
    `/FinancialAllocations/annual-report`,
    { params: { startYear, endYear } }
  );
  return response.data;
}

// Update a financial allocation by id
export async function updateFinancialAllocation(
  id: number,
  dto: FinancialAllocationRequestDto
): Promise<Result<FinancialAllocationResponseDto>> {
  const response = await api.put<Result<FinancialAllocationResponseDto>>(
    `/FinancialAllocations/${id}`,
    dto
  );
  return response.data;
}

// Delete a financial allocation by id
export async function deleteFinancialAllocation(
  id: number
): Promise<Result<null>> {
  const response = await api.delete<Result<null>>(`/FinancialAllocations/${id}`);
  return response.data;
}

// Import allocations from Excel file
export async function importFromExcel(file: File): Promise<Result<string>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Result<string>>(
    "/FinancialAllocations/import-excel",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// Download annual report PDF for a specific year
export async function downloadAnnualReportPdf(year: number): Promise<Blob> {
  const response = await api.get<Blob>(`/FinancialAllocations/annual-report/pdf`, {
    params: { year },
    responseType: "blob",
  });
  return response.data;
}

// Get allocation type percentages for a specific year
export async function getAllocationTypePercentages(
  year: number
): Promise<AllocationTypeSummary[]> {
  const response = await api.get<AllocationTypeSummary[]>(
    `/FinancialAllocations/percentages/${year}`
  );
  return response.data;
}

// New: Get financial allocations by year using API endpoint "annual-reports/{year}"
export async function getFinancialAllocationsByYear(year: number): Promise<Result<FinancialAllocationResponseDto[]>> {
  // Note: Your controller expects year as route param but your method uses [FromQuery].
  // Adjust the request accordingly — here assuming query param as per your code.
  const response = await api.get<Result<FinancialAllocationResponseDto[]>>(
    `/FinancialAllocations/annual-reports/${year}`
  );

  console.log(response.data)

  return response.data;
}


// New: Get totals overview for a specific year using endpoint "totals/{year}"
export interface TotalsOverviewResult {
  totalDonations: number | null;
  totalAllocations: number | null;
  totalAllocationsCount: number;
  difference: number | null;
}

export async function getTotalsOverview(year: number): Promise<TotalsOverviewResult> {
  const response = await api.get<any>(`/FinancialAllocations/totals/${year}`);
  const data = response.data;

  console.log("getTotalsOverview response data:", data);

  // Defensive mapping using nullish coalescing
  return {
    totalDonations: data.totalDonations ?? null,
    totalAllocations: data.totalAllocations ?? null,
    totalAllocationsCount: data.totalAllocationsCount ?? 0,
    difference: data.difference ?? null,
  };
}


import React, { useEffect, useState } from "react";
import { AllocationTypeSummary } from "@/api/financialAllocationService";
import {
  getAllocationTypePercentages,
  downloadAnnualReportPdf,
} from "@/api/financialAllocationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

const FinancialTransparency: React.FC<Props> = () => {
  const currentYear = new Date().getFullYear();
  const firstYear = 2019;

  const [year, setYear] = useState<number>(currentYear - 1);
  const [allocations, setAllocations] = useState<AllocationTypeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllocationTypePercentages(year)
      .then((data) => {
        setAllocations(data);
      })
      .catch(() => {
        setError("⚠️ Unable to load allocation data. Please try again.");
        setAllocations([]);
      })
      .finally(() => setLoading(false));
  }, [year]);

  const handleDownloadReport = async () => {
    try {
      const pdfBlob = await downloadAnnualReportPdf(year);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FinancialReport_${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download annual report. Please try again.");
    }
  };

  return (
    <section className="mt-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-10 shadow-xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Financial Transparency
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Every donation makes an impact. Here’s how we allocated funds across{" "}
          <span className="font-semibold text-gray-900">{year}</span> to ensure
          maximum benefit for our communities.
        </p>

        {/* Year Selector */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <label className="font-medium text-gray-700">View Year:</label>
          <Select
            value={year.toString()}
            onValueChange={(val) => setYear(parseInt(val))}
          >
            <SelectTrigger className="w-30 rounded-sm border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: currentYear - firstYear + 1 },
                (_, i) => currentYear - i
              ).map((yr) => (
                <SelectItem key={yr} value={yr.toString()}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Loading/Error States */}
      {loading && (
        <p className="text-center text-gray-500 text-lg animate-pulse">
          Loading allocation data...
        </p>
      )}
      {error && <p className="text-center text-red-600 font-medium">{error}</p>}

      {/* Data Display */}
      {!loading && !error && allocations.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {allocations.map(
            ({ allocationTypeName, percentageOfYear, totalAmount }) => (
              <div
                key={allocationTypeName}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
              >
                <div
                  className={`text-5xl font-extrabold mb-3 ${allocationTypeName === "Direct Program Support"
                    ? "text-green-600"
                    : allocationTypeName === "Administrative Costs"
                      ? "text-blue-600"
                      : "text-purple-600"
                    }`}
                >
                  {percentageOfYear}%
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {allocationTypeName}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  MMK {totalAmount.toLocaleString()}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Download Report Button */}
      <div className="text-center mt-10">
        <button
          onClick={handleDownloadReport}
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-8 py-3 text-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 transition"
        >
          📄 Download {year} Annual Report
        </button>
      </div>
    </section>
  );
};

export default FinancialTransparency;

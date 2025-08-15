import React, { useEffect, useState } from "react";
import { AllocationTypeSummary } from "@/api/financialAllocationService"; 
import { getAllocationTypePercentages, downloadAnnualReportPdf } from "@/api/financialAllocationService";

type Props = {};

const FinancialTransparency: React.FC<Props> = () => {
  // Get last year dynamically
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const [year, setYear] = useState<number>(lastYear);
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
        setError("Failed to load allocation percentages.");
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
      alert("Failed to download annual report PDF.");
    }
  };

  return (
    <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Transparency</h2>
        <p className="text-xl text-gray-600">
          We believe in complete transparency about how your donations are used.
        </p>

        {/* Year selector - optional but recommended */}
        <div className="mt-4">
          <label htmlFor="year-select" className="mr-2 font-medium text-gray-700">Select Year:</label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {/* You can dynamically populate recent years */}
            {[lastYear, lastYear - 1, lastYear - 2].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading allocation data...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-8">
          {allocations.map(({ allocationTypeName, percentageOfYear, totalAmount }) => (
            <div key={allocationTypeName} className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                allocationTypeName === "Direct Program Support" ? "text-green-600" :
                allocationTypeName === "Administrative Costs" ? "text-blue-600" :
                "text-purple-600"
              }`}>
                {percentageOfYear}%
              </div>
              <div className="text-gray-600">{allocationTypeName}</div>
              {/* Optional: show total amount */}
              <div className="text-sm text-gray-400 mt-1">MMK - {totalAmount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleDownloadReport}
          className="border border-gray-700 rounded-lg px-6 py-3 text-lg hover:bg-gray-100 transition"
        >
          View Annual Report
        </button>
      </div>
    </div>
  );
};

export default FinancialTransparency;

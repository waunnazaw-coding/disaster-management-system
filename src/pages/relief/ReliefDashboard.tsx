import { CheckCircle, ClipboardList, AlertCircle } from "lucide-react"

const ReliefDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-4xl font-bold mb-4 text-gray-700">Relief Team Dashboard</h2>
      <p className="text-gray-600 mb-8">
        Monitor requests, tasks, and overall team progress.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Open Requests */}
        <div className="flex items-center bg-green-50 border border-green-200 p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <AlertCircle className="w-8 h-8 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Open Requests</h3>
            <p className="text-3xl font-bold text-green-900">8</p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="flex items-center bg-blue-50 border border-blue-200 p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <CheckCircle className="w-8 h-8 text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Completed Tasks</h3>
            <p className="text-3xl font-bold text-blue-900">27</p>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="flex items-center bg-gray-50 border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="p-3 bg-gray-100 rounded-full mr-4">
            <ClipboardList className="w-8 h-8 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-900">35</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReliefDashboard;

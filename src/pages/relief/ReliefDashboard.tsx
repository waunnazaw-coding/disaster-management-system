const ReliefDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Relief Team Dashboard</h2>
      <p className="text-gray-700 mb-6">
        View and manage relief requests and team activities here.
      </p>
      {/* Example relief stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Open Requests</h3>
          <p className="text-green-800 text-3xl">8</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Completed Tasks</h3>
          <p className="text-green-800 text-3xl">27</p>
        </div>
      </div>
    </div>
  );
};

export default ReliefDashboard;
